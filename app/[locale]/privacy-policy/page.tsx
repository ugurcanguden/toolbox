'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Cookie, Eye, Lock, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const t = useTranslations('privacyPolicy');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('lastUpdated')}: October 8, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {t('introduction.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{t('introduction.content1')}</p>
            <p>{t('introduction.content2')}</p>
          </CardContent>
        </Card>

        {/* Data Collection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {t('dataCollection.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">{t('dataCollection.weDoNotCollect.title')}</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>{t('dataCollection.weDoNotCollect.item1')}</li>
                <li>{t('dataCollection.weDoNotCollect.item2')}</li>
                <li>{t('dataCollection.weDoNotCollect.item3')}</li>
                <li>{t('dataCollection.weDoNotCollect.item4')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t('dataCollection.localData.title')}</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>{t('dataCollection.localData.item1')}</li>
                <li>{t('dataCollection.localData.item2')}</li>
                <li>{t('dataCollection.localData.item3')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              {t('cookies.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{t('cookies.description')}</p>
            
            <div>
              <h3 className="font-semibold mb-2">{t('cookies.essential.title')}</h3>
              <p className="text-sm text-muted-foreground mb-2">{t('cookies.essential.description')}</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>{t('cookies.essential.item1')}</li>
                <li>{t('cookies.essential.item2')}</li>
                <li>{t('cookies.essential.item3')}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t('cookies.advertising.title')}</h3>
              <p className="text-sm text-muted-foreground mb-2">{t('cookies.advertising.description')}</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>{t('cookies.advertising.item1')}</li>
                <li>{t('cookies.advertising.item2')}</li>
                <li>{t('cookies.advertising.item3')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Google AdSense */}
        <Card>
          <CardHeader>
            <CardTitle>{t('adsense.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{t('adsense.content1')}</p>
            <p>{t('adsense.content2')}</p>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm">
                <strong>{t('adsense.optOut.title')}:</strong>{' '}
                {t('adsense.optOut.description')}{' '}
                <a 
                  href="https://adssettings.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Ads Settings
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Third Party Services */}
        <Card>
          <CardHeader>
            <CardTitle>{t('thirdParty.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{t('thirdParty.description')}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Google AdSense:</strong> {t('thirdParty.adsense')}
              </li>
              <li>
                <strong>Next.js:</strong> {t('thirdParty.nextjs')}
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle>{t('rights.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{t('rights.description')}</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>{t('rights.item1')}</li>
              <li>{t('rights.item2')}</li>
              <li>{t('rights.item3')}</li>
              <li>{t('rights.item4')}</li>
            </ul>
          </CardContent>
        </Card>

        {/* Changes */}
        <Card>
          <CardHeader>
            <CardTitle>{t('changes.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t('changes.content')}</p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {t('contact.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t('contact.content')}</p>
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="text-sm">
                <strong>Domain:</strong> free-dev-tools.net.tr<br />
                <strong>Last Updated:</strong> October 8, 2025
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
