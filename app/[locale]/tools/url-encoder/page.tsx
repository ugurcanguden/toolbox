'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Button, Card, CardHeader, CardTitle, CardContent, Textarea } from '@/components';
import { Copy, Check, AlertCircle, ArrowLeftRight, Link2, Split } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks';

type Mode = 'encode' | 'decode';
type EncodeType = 'component' | 'full';

const SAMPLE_URL = 'https://example.com/search?q=hello world&lang=en&special=éà@#$%';
const SAMPLE_ENCODED_COMPONENT = 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26lang%3Den%26special%3D%C3%A9%C3%A0%40%23%24%25';
const SAMPLE_ENCODED_FULL = 'https://example.com/search?q=hello%20world&lang=en&special=%C3%A9%C3%A0@%23$%25';

export default function UrlEncoderPage() {
  const t = useTranslations('tools.urlEncoder');
  const tc = useTranslations('common');
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [mode, setMode] = React.useState<Mode>('encode');
  const [encodeType, setEncodeType] = React.useState<EncodeType>('component');
  const [queryParams, setQueryParams] = React.useState<Record<string, string>>({});
  const { copied: copiedInput, copy: copyInput } = useCopyToClipboard();
  const { copied: copiedOutput, copy: copyOutput } = useCopyToClipboard();

  const handleEncode = () => {
    try {
      if (!input) {
        setError('Please enter text to encode');
        setOutput('');
        return;
      }

      let encoded: string;
      if (encodeType === 'component') {
        // encodeURIComponent - encodes all characters except: A-Z a-z 0-9 - _ . ! ~ * ' ( )
        encoded = encodeURIComponent(input);
      } else {
        // encodeURI - preserves protocol, domain, and path structure
        encoded = encodeURI(input);
      }
      
      setOutput(encoded);
      parseQueryString(encoded);
      setError('');
    } catch (e) {
      setError('Failed to encode URL');
      setOutput('');
    }
  };

  const handleDecode = () => {
    try {
      if (!input) {
        setError('Please enter URL to decode');
        setOutput('');
        return;
      }

      let decoded: string;
      try {
        decoded = decodeURIComponent(input);
      } catch {
        // If decodeURIComponent fails, try decodeURI
        decoded = decodeURI(input);
      }
      
      setOutput(decoded);
      parseQueryString(input);
      setError('');
    } catch (e) {
      setError('Failed to decode URL. Invalid encoding?');
      setOutput('');
    }
  };

  const handleProcess = () => {
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const parseQueryString = (url: string) => {
    try {
      const urlObj = new URL(url.includes('://') ? url : 'http://dummy.com?' + url);
      const params: Record<string, string> = {};
      urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      setQueryParams(params);
    } catch {
      // If URL parsing fails, try manual query string parsing
      try {
        const queryString = url.includes('?') ? url.split('?')[1] : url;
        const params: Record<string, string> = {};
        if (queryString) {
          queryString.split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            if (key) {
              params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
            }
          });
        }
        setQueryParams(params);
      } catch {
        setQueryParams({});
      }
    }
  };

  React.useEffect(() => {
    if (input && mode === 'encode') {
      handleEncode();
    } else if (input && mode === 'decode') {
      handleDecode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encodeType]);

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    
    if (input && output) {
      const temp = input;
      setInput(output);
      setOutput(temp);
    }
    setError('');
  };

  const loadSample = () => {
    if (mode === 'encode') {
      setInput(SAMPLE_URL);
      const encoded = encodeType === 'component' 
        ? encodeURIComponent(SAMPLE_URL)
        : encodeURI(SAMPLE_URL);
      setOutput(encoded);
      parseQueryString(encoded);
    } else {
      const sample = encodeType === 'component' ? SAMPLE_ENCODED_COMPONENT : SAMPLE_ENCODED_FULL;
      setInput(sample);
      const decoded = decodeURIComponent(sample);
      setOutput(decoded);
      parseQueryString(sample);
    }
    setError('');
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    setQueryParams({});
  };

  const getCharCount = () => {
    return {
      input: input.length,
      output: output.length,
    };
  };

  const charCount = getCharCount();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
            <p className="text-muted-foreground">{t('description')}</p>
          </div>
          <Button onClick={loadSample} variant="outline" size="sm" className="gap-2">
            <Link2 className="h-4 w-4" />
            {tc('sample')} URL
          </Button>
        </div>

        {/* Mode & Type Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          {/* Encode/Decode Toggle */}
          <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
            <span className={`font-medium ${mode === 'encode' ? 'text-primary' : 'text-muted-foreground'}`}>
              Encode
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMode}
              className="h-8 w-8 p-0"
              title="Toggle mode"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
            <span className={`font-medium ${mode === 'decode' ? 'text-primary' : 'text-muted-foreground'}`}>
              Decode
            </span>
          </div>

          {/* Encode Type Toggle (only in encode mode) */}
          {mode === 'encode' && (
            <div className="flex items-center gap-2 border rounded-lg p-1">
              <Button
                size="sm"
                variant={encodeType === 'component' ? 'secondary' : 'ghost'}
                onClick={() => setEncodeType('component')}
                className="h-8 text-xs"
              >
                Component
              </Button>
              <Button
                size="sm"
                variant={encodeType === 'full' ? 'secondary' : 'ghost'}
                onClick={() => setEncodeType('full')}
                className="h-8 text-xs"
              >
                Full URL
              </Button>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        {(input || output) && (
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground bg-muted/30 px-4 py-2 rounded-md">
            <span>Input: <strong>{charCount.input}</strong> chars</span>
            {output && (
              <>
                <span>•</span>
                <span>Output: <strong>{charCount.output}</strong> chars</span>
                <span>•</span>
                <span className={charCount.output > charCount.input ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}>
                  {charCount.output > charCount.input ? '↑' : '↓'} {Math.abs(charCount.output - charCount.input)} chars
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{mode === 'encode' ? 'URL / Text Input' : 'Encoded URL Input'}</CardTitle>
              {input && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyInput(input)}
                  className="h-8"
                >
                  {copiedInput ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Enter URL or text to encode...' : 'Enter encoded URL to decode...'}
              className="min-h-[200px] font-mono text-sm"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleProcess}>
                {mode === 'encode' ? 'Encode' : 'Decode'}
              </Button>
              <Button onClick={clearAll} variant="outline">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{mode === 'encode' ? 'Encoded URL Output' : 'Decoded URL Output'}</CardTitle>
              {output && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyOutput(output)}
                  className="h-8"
                >
                  {copiedOutput ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="flex items-center gap-2 text-destructive mb-4">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            <Textarea
              value={output}
              readOnly
              placeholder={mode === 'encode' ? 'Encoded URL will appear here...' : 'Decoded URL will appear here...'}
              className="min-h-[200px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>

      {/* Query Parameters Parser */}
      {Object.keys(queryParams).length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Split className="h-5 w-5" />
              <CardTitle>Query Parameters</CardTitle>
              <span className="text-sm text-muted-foreground">
                ({Object.keys(queryParams).length} parameters)
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(queryParams).map(([key, value], index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-primary break-all">
                      {key}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-muted-foreground break-all font-mono">
                      {value || <span className="italic opacity-50">(empty)</span>}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(`${key}=${value}`);
                    }}
                    className="h-7 shrink-0"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      <div className="mt-8 p-4 bg-muted/30 rounded-lg">
        <h3 className="font-semibold mb-2">💡 About URL Encoding</h3>
        <p className="text-sm text-muted-foreground mb-4">
          URL encoding converts special characters into a format that can be transmitted over the Internet. 
          Characters that cannot be part of a URL are replaced with a percent sign (%) followed by hexadecimal digits.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <strong className="block mb-2">Encoding Types:</strong>
            <div className="space-y-2 text-muted-foreground">
              <div className="pl-4">
                <strong className="text-foreground">Component:</strong> Encodes all special characters. 
                Use for query parameters, form data.
              </div>
              <div className="pl-4">
                <strong className="text-foreground">Full URL:</strong> Preserves URL structure (://, /, ?, &). 
                Use for complete URLs.
              </div>
            </div>
          </div>
          
          <div>
            <strong className="block mb-2">Common Encodings:</strong>
            <div className="space-y-1 text-muted-foreground font-mono text-xs">
              <div className="flex justify-between">
                <span>Space</span>
                <span className="text-primary">%20 or +</span>
              </div>
              <div className="flex justify-between">
                <span>!</span>
                <span className="text-primary">%21</span>
              </div>
              <div className="flex justify-between">
                <span>#</span>
                <span className="text-primary">%23</span>
              </div>
              <div className="flex justify-between">
                <span>$</span>
                <span className="text-primary">%24</span>
              </div>
              <div className="flex justify-between">
                <span>%</span>
                <span className="text-primary">%25</span>
              </div>
              <div className="flex justify-between">
                <span>&</span>
                <span className="text-primary">%26</span>
              </div>
              <div className="flex justify-between">
                <span>=</span>
                <span className="text-primary">%3D</span>
              </div>
              <div className="flex justify-between">
                <span>@</span>
                <span className="text-primary">%40</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <strong className="block mb-2">Use Cases:</strong>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Encoding query parameters in URLs</li>
            <li>Submitting form data</li>
            <li>Working with APIs that use URL parameters</li>
            <li>Debugging URL-related issues</li>
            <li>Sharing URLs with special characters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

