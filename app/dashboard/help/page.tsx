'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconHammer, IconAlertTriangle } from '@tabler/icons-react';
import { useTranslation } from '@/lib/i18n/hooks';

export default function HelpPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">

        {/* 施工中卡片 */}
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative bg-primary/10 p-6 rounded-full">
                <IconHammer className="size-16 text-primary" strokeWidth={1.5} />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{t('help.underConstruction')}</h2>
              <p className="text-muted-foreground max-w-md">
                {t('help.workingOnDocs')}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
              <IconAlertTriangle className="size-4" />
              <span>{t('help.contactAdmin')}</span>
            </div>
          </CardContent>
        </Card>

        {/* 临时信息卡片 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('help.quickStart')}</CardTitle>
              <CardDescription>{t('help.comingSoon')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('help.quickStartDesc')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('help.faq')}</CardTitle>
              <CardDescription>{t('help.comingSoon')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('help.faqDesc')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('help.apiDocs')}</CardTitle>
              <CardDescription>{t('help.comingSoon')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('help.apiDocsDesc')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}