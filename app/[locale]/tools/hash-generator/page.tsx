'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Textarea,
  ToolSeoContent,
  ToolFaqSection,
  JsonLdTool,
  PrivacyBadge
} from '@/components';
import { Copy, Check, Upload, Shield, ArrowRight } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks';
import { md5, sha1, sha256, sha512, hmac, hashFile, compareHashes, getHashStrength } from '@/lib/crypto-utils';
import { useParams } from 'next/navigation';

type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

export default function HashGeneratorPage() {
  const t = useTranslations('tools.hashGenerator');
  const tc = useTranslations('common');
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  
  const [input, setInput] = React.useState('');
  const [algorithm, setAlgorithm] = React.useState<HashAlgorithm>('SHA-256');
  const [hashes, setHashes] = React.useState<Record<HashAlgorithm, string>>({
    'MD5': '',
    'SHA-1': '',
    'SHA-256': '',
    'SHA-512': ''
  });
  const [hmacEnabled, setHmacEnabled] = React.useState(false);
  const [hmacSecret, setHmacSecret] = React.useState('');
  const [hmacResult, setHmacResult] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [compareHash1, setCompareHash1] = React.useState('');
  const [compareHash2, setCompareHash2] = React.useState('');
  const [compareResult, setCompareResult] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(false);
  
  const { copied: copiedMD5, copy: copyMD5 } = useCopyToClipboard();
  const { copied: copiedSHA1, copy: copySHA1 } = useCopyToClipboard();
  const { copied: copiedSHA256, copy: copySHA256 } = useCopyToClipboard();
  const { copied: copiedSHA512, copy: copySHA512 } = useCopyToClipboard();
  const { copied: copiedHMAC, copy: copyHMAC } = useCopyToClipboard();
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const generateHashes = async () => {
    if (!input) {
      setHashes({
        'MD5': '',
        'SHA-1': '',
        'SHA-256': '',
        'SHA-512': ''
      });
      return;
    }

    setLoading(true);
    try {
      const [md5Hash, sha1Hash, sha256Hash, sha512Hash] = await Promise.all([
        md5(input),
        sha1(input),
        sha256(input),
        sha512(input)
      ]);

      setHashes({
        'MD5': md5Hash,
        'SHA-1': sha1Hash,
        'SHA-256': sha256Hash,
        'SHA-512': sha512Hash
      });
    } catch (error) {
      console.error('Hash generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateHMAC = async () => {
    if (!input || !hmacSecret) {
      setHmacResult('');
      return;
    }

    setLoading(true);
    try {
      const algo = algorithm === 'SHA-256' || algorithm === 'SHA-512' ? algorithm : 'SHA-256';
      const result = await hmac(input, hmacSecret, algo);
      setHmacResult(result);
    } catch (error) {
      console.error('HMAC generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    try {
      const [md5Hash, sha1Hash, sha256Hash, sha512Hash] = await Promise.all([
        hashFile(file, 'MD5'),
        hashFile(file, 'SHA-1'),
        hashFile(file, 'SHA-256'),
        hashFile(file, 'SHA-512')
      ]);

      setHashes({
        'MD5': md5Hash,
        'SHA-1': sha1Hash,
        'SHA-256': sha256Hash,
        'SHA-512': sha512Hash
      });
      setInput(`${t('file')}: ${file.name} (${file.size} ${tc('bytes')})`);
    } catch (error) {
      console.error('File hashing failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = () => {
    if (!compareHash1 || !compareHash2) {
      setCompareResult(null);
      return;
    }
    setCompareResult(compareHashes(compareHash1, compareHash2));
  };

  const clearAll = () => {
    setInput('');
    setHashes({
      'MD5': '',
      'SHA-1': '',
      'SHA-256': '',
      'SHA-512': ''
    });
    setHmacResult('');
    setHmacSecret('');
    setFileName('');
  };

  React.useEffect(() => {
    if (input && !fileName) {
      generateHashes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  React.useEffect(() => {
    if (hmacEnabled && input && hmacSecret) {
      generateHMAC();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hmacEnabled, hmacSecret, algorithm]);

  const HashResultRow = ({ 
    algorithm, 
    hash, 
    copied, 
    onCopy 
  }: { 
    algorithm: HashAlgorithm; 
    hash: string; 
    copied: boolean; 
    onCopy: (text: string) => void;
  }) => {
    const strength = getHashStrength(algorithm);
    
    return (
      <div className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{algorithm}</span>
            <span className={`text-xs ${strength.color}`}>
              {t(strength.translationKey)}
            </span>
          </div>
          {hash && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onCopy(hash)}
              className="h-7"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
        </div>
        <div className="font-mono text-xs break-all text-muted-foreground">
          {hash || t('hashWillAppear')}
        </div>
        {hash && (
          <div className="text-xs text-muted-foreground mt-1">
            {t('length')}: {hash.length} {t('chars')}
          </div>
        )}
      </div>
    );
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

      {/* Input Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('input')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 mb-2">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {t('uploadFile')}
            </Button>
            {fileName && (
              <span className="text-sm text-muted-foreground flex items-center">
                {t('file')}: {fileName}
              </span>
            )}
          </div>
          
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('inputPlaceholder')}
            className="min-h-[150px] font-mono text-sm"
          />

          {/* HMAC Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hmac"
                checked={hmacEnabled}
                onChange={(e) => setHmacEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="hmac" className="text-sm font-medium">
                {t('enableHMAC')}
              </label>
            </div>
            
            {hmacEnabled && (
              <input
                type="text"
                value={hmacSecret}
                onChange={(e) => setHmacSecret(e.target.value)}
                placeholder={t('hmacSecretPlaceholder')}
                className="w-full h-10 px-3 text-sm rounded-md border border-input bg-background font-mono"
              />
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={clearAll} variant="outline">
              {t('clear')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hash Results */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>{t('hashResults')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('generating')}...
            </div>
          ) : (
            <div className="space-y-3">
              <HashResultRow algorithm="MD5" hash={hashes['MD5']} copied={copiedMD5} onCopy={copyMD5} />
              <HashResultRow algorithm="SHA-1" hash={hashes['SHA-1']} copied={copiedSHA1} onCopy={copySHA1} />
              <HashResultRow algorithm="SHA-256" hash={hashes['SHA-256']} copied={copiedSHA256} onCopy={copySHA256} />
              <HashResultRow algorithm="SHA-512" hash={hashes['SHA-512']} copied={copiedSHA512} onCopy={copySHA512} />
              
              {hmacEnabled && hmacResult && (
                <div className="p-4 bg-blue-500/10 rounded-lg border-2 border-blue-500/20">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{t('hmacTitle')}-{algorithm}</span>
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        {t('hmacSubtitle')}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyHMAC(hmacResult)}
                      className="h-7"
                    >
                      {copiedHMAC ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <div className="font-mono text-xs break-all text-foreground">
                    {hmacResult}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compare Hashes */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('compareHashes')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={compareHash1}
              onChange={(e) => setCompareHash1(e.target.value)}
              placeholder={t('hash1Placeholder')}
              className="h-10 px-3 text-sm rounded-md border border-input bg-background font-mono"
            />
            <input
              type="text"
              value={compareHash2}
              onChange={(e) => setCompareHash2(e.target.value)}
              placeholder={t('hash2Placeholder')}
              className="h-10 px-3 text-sm rounded-md border border-input bg-background font-mono"
            />
          </div>
          
          <Button onClick={handleCompare} className="gap-2">
            <ArrowRight className="h-4 w-4" />
            {t('compare')}
          </Button>

          {compareResult !== null && (
            <div
              className={`flex items-center gap-2 p-3 rounded-md ${
                compareResult
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
              }`}
            >
              {compareResult ? (
                <>
                  <Check className="h-5 w-5" />
                  <span className="font-medium">{t('hashesMatch')}</span>
                </>
              ) : (
                <>
                  <span className="font-medium">{t('hashesDoNotMatch')}</span>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ToolSeoContent toolId="hashGenerator" />
      <ToolFaqSection toolId="hashGenerator" />

      <JsonLdTool
        locale={locale}
        tool={{
          id: "hash-generator",
          title: t("title"),
          description: t("description"),
          category: "utilities"
        }}
      />
    </div>
  );
}

