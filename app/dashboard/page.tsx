'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SectionCards } from "@/components/section-cards"
import { QuotaTrendChart } from "@/components/quota-trend-chart"
import { SharedPoolModels } from "@/components/shared-pool-models"
import { MorphingSquare } from '@/components/ui/morphing-square';
import { useTranslation } from '@/lib/i18n/hooks';

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const loginSuccess = searchParams.get('login');
    if (loginSuccess === 'success') {
      router.replace('/dashboard');
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />

      <div className="px-4 lg:px-6">
        <QuotaTrendChart />
      </div>

      <div className="px-4 lg:px-6">
        <SharedPoolModels />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { t } = useTranslation()

  return (
    <Suspense fallback={<div className="px-4 lg:px-6">
      <div className="flex items-center justify-center min-h-screen">
        <MorphingSquare message={t('common.loading')} />
      </div>
    </div>}>
      <DashboardContent />
    </Suspense>
  )
}
