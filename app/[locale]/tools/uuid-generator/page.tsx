'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Button, Card, CardHeader, CardTitle, CardContent, JsonLdTool, ToolSeoContent, ToolFaqSection, PrivacyBadge } from '@/components';
import { Copy, Check, RefreshCw, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks';
import { useParams } from 'next/navigation';

export default function UuidGeneratorPage() {
  const t = useTranslations('tools.uuidGenerator');
  const [uuids, setUuids] = React.useState<string[]>([]);
  const [count, setCount] = React.useState(1);
  const [uppercase, setUppercase] = React.useState(false);
  const [withHyphens, setWithHyphens] = React.useState(true);
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const { copied: copiedAll, copy: copyAll } = useCopyToClipboard();
  const params = useParams();
  const locale = (params.locale as string) || 'en';

  
  // Validation states
  const [validateInput, setValidateInput] = React.useState('');
  const [validationResult, setValidationResult] = React.useState<{
    isValid: boolean;
    version?: number;
    message: string;
  } | null>(null);

  const generateUUID = (): string => {
    return crypto.randomUUID();
  };

  const formatUUID = (uuid: string): string => {
    let formatted = uuid;
    
    if (!withHyphens) {
      formatted = formatted.replace(/-/g, '');
    }
    
    if (uppercase) {
      formatted = formatted.toUpperCase();
    }
    
    return formatted;
  };

  const generateUUIDs = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(generateUUID());
    }
    setUuids(newUuids);
  };

  const handleCopyIndividual = async (uuid: string, index: number) => {
    try {
      await navigator.clipboard.writeText(formatUUID(uuid));
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  const handleCopyAll = () => {
    const formatted = uuids.map(formatUUID).join('\n');
    copyAll(formatted);
  };

  const clearAll = () => {
    setUuids([]);
  };

  const validateUUID = () => {
    const input = validateInput.trim();
    
    if (!input) {
      setValidationResult({
        isValid: false,
        message: t('invalidUuid'),
      });
      return;
    }

    // UUID regex patterns
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const uuidV4NoHyphensRegex = /^[0-9a-f]{12}4[0-9a-f]{3}[89ab][0-9a-f]{15}$/i;
    const uuidAnyVersionRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    // Check for v4 with hyphens
    if (uuidV4Regex.test(input)) {
      setValidationResult({
        isValid: true,
        version: 4,
        message: t('validUuid'),
      });
      return;
    }

    // Check for v4 without hyphens
    if (uuidV4NoHyphensRegex.test(input)) {
      setValidationResult({
        isValid: true,
        version: 4,
        message: t('validUuid'),
      });
      return;
    }

    // Check for any UUID version with hyphens
    if (uuidAnyVersionRegex.test(input)) {
      const versionChar = input.charAt(14);
      const version = parseInt(versionChar, 16);
      setValidationResult({
        isValid: true,
        version: version,
        message: t('validUuid'),
      });
      return;
    }

    // Invalid
    setValidationResult({
      isValid: false,
      message: t('invalidUuid'),
    });
  };

  // Generate initial UUID on mount
  React.useEffect(() => {
    generateUUIDs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 1000) {
      setCount(value);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">{t('description')}</p>
        </div>
        <PrivacyBadge />
      </div>

      {/* Controls Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {t('settings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Count Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">{t('numberOfUuids')}</label>
              <input
                type="number"
                value={count}
                onChange={handleCountChange}
                min="1"
                max="1000"
                className="w-20 px-3 py-1 text-sm rounded-md border border-input bg-background"
              />
            </div>
            <input
              type="range"
              value={count}
              onChange={handleCountChange}
              min="1"
              max="100"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium">{t('uppercase')}</span>
              <button
                onClick={() => setUppercase(!uppercase)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  uppercase ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    uppercase ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium">{t('withHyphens')}</span>
              <button
                onClick={() => setWithHyphens(!withHyphens)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  withHyphens ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    withHyphens ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={generateUUIDs} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              {t('generate')}
            </Button>
            {uuids.length > 0 && (
              <>
                <Button onClick={handleCopyAll} variant="secondary" className="gap-2">
                  {copiedAll ? (
                    <>
                      <Check className="h-4 w-4" />
                      {t('copiedAll')}
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      {t('copyAll')}
                    </>
                  )}
                </Button>
                <Button onClick={clearAll} variant="outline" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  {t('clear')}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* UUIDs Display */}
      {uuids.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('generatedUuids')}</CardTitle>
              <span className="text-sm text-muted-foreground">
                {uuids.length} {uuids.length === 1 ? t('uuid') : t('uuids')}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {uuids.map((uuid, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors group"
                >
                  <span className="text-xs text-muted-foreground w-8 shrink-0">
                    #{index + 1}
                  </span>
                  <code className="flex-1 text-sm font-mono break-all">
                    {formatUUID(uuid)}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyIndividual(uuid, index)}
                    className="h-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {t('validation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={validateInput}
              onChange={(e) => setValidateInput(e.target.value)}
              placeholder={t('validatePlaceholder')}
              className="flex-1 h-10 px-3 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-mono"
            />
            <Button onClick={validateUUID} variant="secondary">
              {t('validate')}
            </Button>
          </div>

          {validationResult && (
            <div
              className={`flex items-center gap-2 p-3 rounded-md ${
                validationResult.isValid
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
              }`}
            >
              {validationResult.isValid ? (
                <Check className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="font-medium">{validationResult.message}</span>
              {validationResult.version && (
                <span className="ml-auto text-sm">
                  {t('version')} {validationResult.version}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ToolSeoContent toolId="uuidGenerator" />
      <ToolFaqSection toolId="uuidGenerator" />

      <JsonLdTool 
        locale={locale}
        tool={{
          id: 'uuid-generator',
          title: t('title'),
          description: t('description'),
          category: 'utilities'
        }}
      />
    </div>
  );
}

