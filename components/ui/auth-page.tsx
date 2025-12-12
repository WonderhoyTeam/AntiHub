'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';
import { useRouter, useSearchParams } from 'next/navigation';

import {
	AtSignIcon,
	ChevronLeftIcon,
} from 'lucide-react';
import { Input } from './input';
import { getOIDCProviders, initiateOIDCLogin, checkEmailExists, sendEmailLogin, isAuthenticated, type OIDCProvider } from '@/lib/api';
import { MorphingSquare } from './morphing-square';
import { useI18n } from '@/lib/i18n/context';

const ERROR_KEYS: Record<string, string> = {
	'missing_oauth_params': 'loginPage.errors.missingOauthParams',
	'oauth_callback_failed': 'loginPage.errors.oauthCallbackFailed',
	'missing_token': 'loginPage.errors.missingToken',
};

export function AuthPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { t } = useI18n();
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
	const [providers, setProviders] = useState<OIDCProvider[]>([]);
	const [providersError, setProvidersError] = useState('');
	const [error, setError] = useState('');

	// Fetch available providers
	useEffect(() => {
		const fetchProviders = async () => {
			try {
				const availableProviders = await getOIDCProviders();
				setProviders(availableProviders);
			} catch (err) {
				console.error('Failed to fetch OIDC providers:', err);
				setProvidersError(err instanceof Error ? err.message : 'Failed to load authentication providers');
			}
		};
		fetchProviders();
	}, []);

	// Check if already logged in
	useEffect(() => {
		if (isAuthenticated()) {
			router.push('/dashboard');
		}
	}, [router]);

	// Check URL for error parameters
	useEffect(() => {
		const errorParam = searchParams.get('error');
		if (errorParam) {
			const errorKey = ERROR_KEYS[errorParam];
			setError(errorKey ? t(errorKey) : errorParam);
		}
	}, [searchParams, t]);

	// Handle email login
	const handleEmailLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			// Check if email exists
			const exists = await checkEmailExists(email);
			if (!exists) {
				setError(t('loginPage.errors.userNotFound'));
				return;
			}

			// Send login email
			const result = await sendEmailLogin(email);
			if (result.success) {
				// Show success message
				setError(''); // Clear error
				alert(t('loginPage.errors.loginLinkSent'));
			} else {
				setError(result.message || t('loginPage.errors.sendEmailFailed'));
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : t('loginPage.errors.loginFailed'));
		} finally {
			setIsLoading(false);
		}
	};

	// Handle OAuth login for any provider
	const handleOAuthLogin = async (providerId: string) => {
		setError('');
		setLoadingProvider(providerId);

		try {
			await initiateOIDCLogin(providerId);
		} catch (err) {
			setError(err instanceof Error ? err.message : t('loginPage.errors.providerLoginFailed', { provider: providerId }));
			setLoadingProvider(null);
		}
	};

	// Get provider-specific icon
	const getProviderIcon = (providerId: string) => {
		switch (providerId) {
			case 'linux_do':
				return <img src="/linuxdoconnect.png" alt="Linux.do" className="size-4 me-2" />;
			case 'github':
				return (
					<svg className="size-4 me-2" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
					</svg>
				);
			case 'pocketid':
				return <AtSignIcon className="size-4 me-2" />;
			default:
				return <AtSignIcon className="size-4 me-2" />;
		}
	};

	return (
		<main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2 bg-black">
			<div className="bg-black relative hidden h-full flex-col border-r border-white/10 p-10 lg:flex">
				<div className="from-black absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
				<div className="z-10 flex items-center gap-2">
					<img src="/logo_dark.png" alt="Logo" className="h-8" />
					<p className="text-xl font-semibold text-white">AntiHub</p>
				</div>
				<div className="z-10 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-xl text-white">
							&ldquo;{t('loginPage.testimonial')}&rdquo;
						</p>
						<footer className="font-mono text-sm font-semibold text-white/70">
							~ Ali Hassan
						</footer>
					</blockquote>
				</div>
				<div className="absolute inset-0">
					<FloatingPaths position={1} />
					<FloatingPaths position={-1} />
				</div>
			</div>
			<div className="relative flex min-h-screen flex-col justify-center p-4 bg-black">
				<div
					aria-hidden
					className="absolute inset-0 isolate contain-strict -z-10 opacity-30"
				>
					<div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(255,255,255,0.1)_0,rgba(255,255,255,0.02)_50%,rgba(255,255,255,0.01)_80%)] absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full" />
					<div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.01)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 [translate:5%_-50%] rounded-full" />
					<div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.01)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full" />
				</div>
				<Button variant="ghost" className="absolute top-7 left-5 text-white hover:bg-white/30 hover:text-white" asChild>
					<a href="/">
						<ChevronLeftIcon className='size-4 me-2' />
						{t('loginPage.home')}
					</a>
				</Button>
				<div className="mx-auto space-y-4 sm:w-sm">
					<div className="flex items-center gap-2 lg:hidden">
						<img src="/logo_dark.png" alt="Logo" className="h-8" />
						<p className="text-xl font-semibold text-white">AntiHub</p>
					</div>
					<div className="flex flex-col space-y-2">
						<h1 className="font-heading text-2xl font-bold tracking-wide text-white">
							{t('loginPage.title')}
						</h1>
						<p className="text-white/60 text-start text-xs">
							{t('loginPage.subtitle')}
						</p>
					</div>
					<div className="space-y-2">
						{providersError && (
							<div className="text-red-400 text-sm p-2 bg-red-500/10 border border-red-500/20 rounded">
								{providersError}
							</div>
						)}

						{providers.length === 0 && !providersError && (
							<div className="text-white/60 text-sm p-2 text-center">
								{t('loginPage.loadingProviders')}
							</div>
						)}

						{providers.map(provider => (
							<Button
								key={provider.id}
								type="button"
								size="lg"
								variant={provider.id === 'linux_do' ? 'default' : 'outline'}
								className={provider.id === 'linux_do'
									? "w-full bg-white text-black hover:bg-white/90 cursor-pointer"
									: "w-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white cursor-pointer"}
								onClick={() => handleOAuthLogin(provider.id)}
								disabled={loadingProvider !== null || isLoading}
							>
								{loadingProvider === provider.id ? (
									<MorphingSquare className="size-4 me-2" />
								) : (
									getProviderIcon(provider.id)
								)}
								{t('loginPage.continueWith', { provider: provider.name })}
							</Button>
						))}
					</div>

					<AuthSeparator orText={t('loginPage.or')} />

					<form className="space-y-2" onSubmit={handleEmailLogin}>
						<p className="text-white/60 text-start text-xs">
							{t('loginPage.emailLogin')}
						</p>
						
						{error && (
							<div className="text-red-400 text-sm p-2 bg-red-500/10 border border-red-500/20 rounded">
								{error}
							</div>
						)}

						<div className="relative h-max">
							<Input
								placeholder="your.email@example.com"
								className="peer ps-9 bg-white/5 border-white/10 text-white placeholder:text-white/40"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={isLoading || loadingProvider !== null}
							/>
							<div className="text-white/60 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
								<AtSignIcon className="size-4" aria-hidden="true" />
							</div>
						</div>

						<Button
							type="submit"
							className="w-full bg-white text-black hover:bg-white/90 cursor-pointer"
							disabled={isLoading || loadingProvider !== null}
						>
							{isLoading ? (
								<>
									<MorphingSquare className="size-4 me-2" />
									{t('loginPage.loggingIn')}
								</>
							) : (
								<span>{t('loginPage.continue')}</span>
							)}
						</Button>
					</form>
					<p className="text-white/50 mt-8 text-sm">
						{t('loginPage.termsNotice')}{' '}
						<a
							href="#"
							className="hover:text-white underline underline-offset-4 text-white/70"
						>
							{t('loginPage.termsOfService')}
						</a>{' '}
						{t('loginPage.and')}{' '}
						<a
							href="#"
							className="hover:text-white underline underline-offset-4 text-white/70"
						>
							{t('loginPage.privacyPolicy')}
						</a>
						.
					</p>
				</div>
			</div>
		</main>
	);
}

function FloatingPaths({ position }: { position: number }) {
	const paths = Array.from({ length: 36 }, (_, i) => ({
		id: i,
		d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
			380 - i * 5 * position
		} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
			152 - i * 5 * position
		} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
			684 - i * 5 * position
		} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
		color: `rgba(15,23,42,${0.1 + i * 0.03})`,
		width: 0.5 + i * 0.03,
	}));

	return (
		<div className="pointer-events-none absolute inset-0">
			<svg
				className="h-full w-full text-white"
				viewBox="0 0 696 316"
				fill="none"
			>
				<title>Background Paths</title>
				{paths.map((path) => (
					<motion.path
						key={path.id}
						d={path.d}
						stroke="currentColor"
						strokeWidth={path.width}
						strokeOpacity={0.1 + path.id * 0.03}
						initial={{ pathLength: 0.3, opacity: 0.6 }}
						animate={{
							pathLength: 1,
							opacity: [0.3, 0.6, 0.3],
							pathOffset: [0, 1, 0],
						}}
						transition={{
							duration: 20 + Math.random() * 10,
							repeat: Number.POSITIVE_INFINITY,
							ease: 'linear',
						}}
					/>
				))}
			</svg>
		</div>
	);
}

const AuthSeparator = ({ orText }: { orText: string }) => {
	return (
		<div className="flex w-full items-center justify-center">
			<div className="bg-white/10 h-px w-full" />
			<span className="text-white/60 px-2 text-xs">{orText}</span>
			<div className="bg-white/10 h-px w-full" />
		</div>
	);
};
