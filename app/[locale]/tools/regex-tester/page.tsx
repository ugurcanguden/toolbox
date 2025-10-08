'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Button, Card, CardHeader, CardTitle, CardContent, Textarea, Input, Label, Checkbox } from '@/components';
import { Copy, Check, Search, Replace, BookOpen, AlertCircle, Info } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks';

interface Match {
  fullMatch: string;
  groups: string[];
  index: number;
}

interface CommonPattern {
  name: string;
  pattern: string;
  description: string;
}

const COMMON_PATTERNS: CommonPattern[] = [
  { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', description: 'Email address' },
  { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)', description: 'Web URL' },
  { name: 'Phone', pattern: '\\+?[1-9]\\d{1,14}', description: 'International phone' },
  { name: 'IPv4', pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b', description: 'IP address' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}', description: 'ISO date format' },
  { name: 'Time (HH:MM)', pattern: '([01]?[0-9]|2[0-3]):[0-5][0-9]', description: '24-hour time' },
  { name: 'Hex Color', pattern: '#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})', description: 'Hexadecimal color' },
  { name: 'Username', pattern: '^[a-zA-Z0-9_-]{3,16}$', description: 'Alphanumeric username' },
  { name: 'Strong Password', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', description: 'Min 8 chars, upper, lower, digit, special' },
  { name: 'Credit Card', pattern: '\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b', description: 'Credit card number' },
];

export default function RegexTesterPage() {
  const t = useTranslations('tools.regexTester');
  const tc = useTranslations('common');
  const [pattern, setPattern] = React.useState('');
  const [testText, setTestText] = React.useState('');
  const [flags, setFlags] = React.useState({
    g: true,  // global
    i: false, // case insensitive
    m: false, // multiline
    s: false, // dotAll
    u: false, // unicode
    y: false, // sticky
  });
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [error, setError] = React.useState('');
  const [replaceText, setReplaceText] = React.useState('');
  const [replacedOutput, setReplacedOutput] = React.useState('');
  const { copied: copiedPattern, copy: copyPattern } = useCopyToClipboard();
  const { copied: copiedOutput, copy: copyOutput } = useCopyToClipboard();

  const getFlagsString = () => {
    return Object.entries(flags)
      .filter(([_, enabled]) => enabled)
      .map(([flag]) => flag)
      .join('');
  };

  const testRegex = React.useCallback(() => {
    if (!pattern || !testText) {
      setMatches([]);
      setError('');
      return;
    }

    try {
      const flagsStr = getFlagsString();
      const regex = new RegExp(pattern, flagsStr);
      const matchResults: Match[] = [];

      if (flags.g) {
        // Global flag - find all matches
        let match;
        while ((match = regex.exec(testText)) !== null) {
          matchResults.push({
            fullMatch: match[0],
            groups: match.slice(1),
            index: match.index,
          });
          
          // Prevent infinite loop
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        // Single match
        const match = regex.exec(testText);
        if (match) {
          matchResults.push({
            fullMatch: match[0],
            groups: match.slice(1),
            index: match.index,
          });
        }
      }

      setMatches(matchResults);
      setError('');
    } catch (e) {
      setError((e as Error).message || 'Invalid regex pattern');
      setMatches([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern, testText, flags]);

  const performReplace = () => {
    if (!pattern || !testText) return;

    try {
      const flagsStr = getFlagsString();
      const regex = new RegExp(pattern, flagsStr);
      const replaced = testText.replace(regex, replaceText);
      setReplacedOutput(replaced);
      setError('');
    } catch (e) {
      setError((e as Error).message || 'Invalid regex pattern');
    }
  };

  const loadPattern = (commonPattern: CommonPattern) => {
    setPattern(commonPattern.pattern);
  };

  const clearAll = () => {
    setPattern('');
    setTestText('');
    setReplaceText('');
    setReplacedOutput('');
    setMatches([]);
    setError('');
  };

  const loadSample = () => {
    setPattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
    setTestText('Contact us at support@example.com or sales@company.org for more information. admin@test.co.uk is also available.');
  };

  // Real-time testing
  React.useEffect(() => {
    const timer = setTimeout(() => {
      testRegex();
    }, 300);
    return () => clearTimeout(timer);
  }, [testRegex]);

  // Replace when replace text changes
  React.useEffect(() => {
    if (replaceText) {
      performReplace();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replaceText, pattern, testText, flags]);

  const highlightMatches = () => {
    if (matches.length === 0) return testText;

    let result = testText;
    let offset = 0;

    matches.forEach((match, idx) => {
      const startTag = `<mark class="bg-yellow-300 dark:bg-yellow-600 text-foreground px-0.5 rounded font-semibold" data-match="${idx}">`;
      const endTag = '</mark>';
      const insertPos = match.index + offset;

      result =
        result.slice(0, insertPos) +
        startTag +
        result.slice(insertPos, insertPos + match.fullMatch.length) +
        endTag +
        result.slice(insertPos + match.fullMatch.length);

      offset += startTag.length + endTag.length;
    });

    return result;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
            <p className="text-muted-foreground">{t('description')}</p>
          </div>
          <Button onClick={loadSample} variant="outline" size="sm" className="gap-2">
            <Search className="h-4 w-4" />
            {tc('sample')}
          </Button>
        </div>

        {/* Stats Bar */}
        {matches.length > 0 && (
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground bg-muted/30 px-4 py-2 rounded-md">
            <span>{t('matches')}: <strong className="text-green-600 dark:text-green-400">{matches.length}</strong></span>
            <span>•</span>
            <span>{t('pattern')}: <code className="font-mono">{pattern}</code></span>
            {getFlagsString() && (
              <>
                <span>•</span>
                <span>{t('flags')}: <code className="font-mono">/{getFlagsString()}/</code></span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pattern Input */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('regexPattern')}</CardTitle>
                {pattern && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyPattern(pattern)}
                    className="h-7"
                  >
                    {copiedPattern ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder={t('patternPlaceholder')}
                className="font-mono"
              />

              {/* Flags */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('flags')}</Label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(flags).map(([flag, enabled]) => (
                    <div key={flag} className="flex items-center space-x-2">
                      <Checkbox
                        id={flag}
                        checked={enabled}
                        onCheckedChange={(checked) =>
                          setFlags({ ...flags, [flag]: checked as boolean })
                        }
                      />
                      <Label htmlFor={flag} className="text-xs font-mono cursor-pointer">
                        {flag}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div><code className="font-mono">g</code> - {t('flagG')}</div>
                  <div><code className="font-mono">i</code> - {t('flagI')}</div>
                  <div><code className="font-mono">m</code> - {t('flagM')}</div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm p-2 bg-destructive/10 rounded">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Common Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {t('commonPatterns')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {COMMON_PATTERNS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadPattern(p)}
                    className="w-full text-left p-2 rounded hover:bg-accent transition-colors group"
                  >
                    <div className="font-medium text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground truncate group-hover:text-foreground">
                      {p.description}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test & Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Test Text */}
          <Card>
            <CardHeader>
              <CardTitle>{t('testText')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder={t('testTextPlaceholder')}
                className="min-h-[200px] font-mono text-sm"
              />
              <Button onClick={clearAll} variant="outline">
                {t('clear')}
              </Button>
            </CardContent>
          </Card>

          {/* Matches */}
          {matches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-green-500" />
                  {t('matchesFound')}: {matches.length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {matches.map((match, idx) => (
                    <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-sm font-medium">
                          {t('match')} #{idx + 1}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {t('position')}: {match.index}
                        </span>
                      </div>
                      <code className="block text-sm bg-background p-2 rounded border break-all">
                        {match.fullMatch}
                      </code>
                      {match.groups.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <div className="text-xs font-medium text-muted-foreground">
                            {t('captureGroups')}:
                          </div>
                          {match.groups.map((group, gIdx) => (
                            <div key={gIdx} className="text-xs pl-4">
                              <span className="text-primary">Group {gIdx + 1}:</span>{' '}
                              <code className="bg-muted px-1 rounded">{group || '(empty)'}</code>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Highlighted Text */}
          <Card>
            <CardHeader>
              <CardTitle>{t('highlightedText')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="font-mono text-sm p-4 bg-muted/30 rounded-lg min-h-[200px] whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{ __html: highlightMatches() }}
              />
            </CardContent>
          </Card>

          {/* Replace */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Replace className="h-5 w-5" />
                {t('replaceFunction')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('replaceWith')}</Label>
                <Input
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder={t('replaceWithPlaceholder')}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  {t('replaceHint')}: $1, $2, etc.
                </p>
              </div>

              {replacedOutput && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>{t('replacedOutput')}</Label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyOutput(replacedOutput)}
                        className="h-7"
                      >
                        {copiedOutput ? (
                          <>
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                    <Textarea
                      value={replacedOutput}
                      readOnly
                      className="min-h-[100px] font-mono text-sm bg-green-50 dark:bg-green-950/20"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-5 w-5" />
          <h3 className="font-semibold">{t('aboutTitle')}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {t('aboutDescription')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <strong className="block mb-2">{t('flagsExplanation')}:</strong>
            <div className="space-y-1 text-muted-foreground">
              <div><code className="font-mono bg-muted px-1 rounded">g</code> - {t('flagG')}</div>
              <div><code className="font-mono bg-muted px-1 rounded">i</code> - {t('flagI')}</div>
              <div><code className="font-mono bg-muted px-1 rounded">m</code> - {t('flagM')}</div>
              <div><code className="font-mono bg-muted px-1 rounded">s</code> - {t('flagS')}</div>
              <div><code className="font-mono bg-muted px-1 rounded">u</code> - {t('flagU')}</div>
              <div><code className="font-mono bg-muted px-1 rounded">y</code> - {t('flagY')}</div>
            </div>
          </div>

          <div>
            <strong className="block mb-2">{t('specialCharacters')}:</strong>
            <div className="space-y-1 text-muted-foreground font-mono text-xs">
              <div><code className="bg-muted px-1 rounded">.</code> - {t('charAny')}</div>
              <div><code className="bg-muted px-1 rounded">^</code> - {t('charStart')}</div>
              <div><code className="bg-muted px-1 rounded">$</code> - {t('charEnd')}</div>
              <div><code className="bg-muted px-1 rounded">*</code> - {t('char0OrMore')}</div>
              <div><code className="bg-muted px-1 rounded">+</code> - {t('char1OrMore')}</div>
              <div><code className="bg-muted px-1 rounded">?</code> - {t('char0Or1')}</div>
              <div><code className="bg-muted px-1 rounded">\d</code> - {t('charDigit')}</div>
              <div><code className="bg-muted px-1 rounded">\w</code> - {t('charWord')}</div>
              <div><code className="bg-muted px-1 rounded">\s</code> - {t('charWhitespace')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

