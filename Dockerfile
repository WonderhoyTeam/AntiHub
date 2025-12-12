# --- Base Stage ---
FROM node:20-alpine AS base

WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# --- Dependencies Stage ---
FROM base AS dependencies

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install all dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# --- Build Stage ---
FROM base AS build

# Copy only necessary files first
COPY package.json pnpm-lock.yaml* ./
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source files (excluding files in .dockerignore)
COPY . .

# Build the Next.js application with cache mounts
RUN --mount=type=cache,id=nextjs,target=/app/.next/cache \
    pnpm build

# --- Production Stage ---
FROM base AS production

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --ingroup appgroup appuser

WORKDIR /app

# Copy only production dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./

# Set ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
