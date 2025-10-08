'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Button, Card, CardHeader, CardTitle, CardContent, Textarea } from '@/components';
import { Copy, Check, AlertCircle, Code2, FileJson, Search, ChevronsDownUp, ChevronsUpDown, TreePine, Download } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks';
import { XMLTreeViewer } from '@/components/tools/xml-tree-viewer';
import { formatXML, minifyXML, validateXML, parseXML, domToXMLNode } from '@/lib/xml-utils';

type ViewMode = 'formatted' | 'tree';

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction">
    <title lang="en">Harry Potter</title>
    <author>J.K. Rowling</author>
    <year>2005</year>
    <price currency="USD">29.99</price>
  </book>
  <book category="programming">
    <title lang="en">Learning TypeScript</title>
    <author>Josh Goldberg</author>
    <year>2022</year>
    <price currency="USD">45.00</price>
  </book>
  <!-- More books can be added here -->
</bookstore>`;

export default function XmlFormatterPage() {
  const t = useTranslations('tools.xmlFormatter');
  const tc = useTranslations('common');
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [parsedXml, setParsedXml] = React.useState<any>(null);
  const [error, setError] = React.useState('');
  const [viewMode, setViewMode] = React.useState<ViewMode>('tree');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [expandAll, setExpandAll] = React.useState(true);
  const { copied, copy } = useCopyToClipboard();

  const formatXml = () => {
    try {
      const formatted = formatXML(input, 2);
      const xmlDoc = parseXML(input);
      
      if (!xmlDoc) {
        setError(t('invalidXml'));
        setOutput('');
        setParsedXml(null);
        return;
      }
      
      setOutput(formatted);
      setParsedXml(domToXMLNode(xmlDoc.documentElement));
      setError('');
    } catch (e) {
      setError(t('invalidXml'));
      setOutput('');
      setParsedXml(null);
    }
  };

  const minifyXml = () => {
    try {
      const minified = minifyXML(input);
      const xmlDoc = parseXML(input);
      
      if (!xmlDoc) {
        setError(t('invalidXml'));
        setOutput('');
        setParsedXml(null);
        return;
      }
      
      setOutput(minified);
      setParsedXml(domToXMLNode(xmlDoc.documentElement));
      setError('');
    } catch (e) {
      setError(t('invalidXml'));
      setOutput('');
      setParsedXml(null);
    }
  };

  const validateXml = () => {
    const validation = validateXML(input);
    if (validation.valid) {
      setError('');
      alert(t('validXml'));
      const xmlDoc = parseXML(input);
      if (xmlDoc) {
        setParsedXml(domToXMLNode(xmlDoc.documentElement));
      }
    } else {
      setError(validation.error || t('invalidXml'));
      setParsedXml(null);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setParsedXml(null);
    setError('');
  };

  const loadSampleXml = () => {
    setInput(SAMPLE_XML);
    setOutput(formatXML(SAMPLE_XML, 2));
    const xmlDoc = parseXML(SAMPLE_XML);
    if (xmlDoc) {
      setParsedXml(domToXMLNode(xmlDoc.documentElement));
    }
    setError('');
  };

  const handleCopy = () => {
    copy(output);
  };

  const downloadXml = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleExpandAll = () => {
    setExpandAll(!expandAll);
  };

  const getCharCount = () => {
    return {
      input: input.length,
      output: output.length,
      reduction: input.length > 0 && output.length > 0 
        ? Math.round(((input.length - output.length) / input.length) * 100)
        : 0
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
          <Button onClick={loadSampleXml} variant="outline" size="sm" className="gap-2">
            <FileJson className="h-4 w-4" />
            {tc('loadSample')}
          </Button>
        </div>
        
        {/* Stats Bar */}
        {(input || output) && (
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground bg-muted/30 px-4 py-2 rounded-md">
            <span>Input: <strong>{charCount.input}</strong> chars</span>
            {output && (
              <>
                <span>•</span>
                <span>Output: <strong>{charCount.output}</strong> chars</span>
                {charCount.reduction !== 0 && (
                  <>
                    <span>•</span>
                    <span className={charCount.reduction > 0 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}>
                      {charCount.reduction > 0 ? '↓' : '↑'} {Math.abs(charCount.reduction)}% size
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('input')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('inputPlaceholder')}
              className="min-h-[400px] font-mono text-sm"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={formatXml}>{t('format')}</Button>
              <Button onClick={minifyXml} variant="secondary">
                {t('minify')}
              </Button>
              <Button onClick={validateXml} variant="outline">
                {t('validate')}
              </Button>
              <Button onClick={clearAll} variant="outline">
                {t('clear')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-3">
              <CardTitle>{t('output')}</CardTitle>
              <div className="flex items-center gap-2">
                {parsedXml && (
                  <div className="flex items-center gap-1 border rounded-md p-1">
                    <Button
                      size="sm"
                      variant={viewMode === 'tree' ? 'secondary' : 'ghost'}
                      onClick={() => setViewMode('tree')}
                      className="h-7 px-2"
                    >
                      <TreePine className="h-3.5 w-3.5 mr-1" />
                      Tree
                    </Button>
                    <Button
                      size="sm"
                      variant={viewMode === 'formatted' ? 'secondary' : 'ghost'}
                      onClick={() => setViewMode('formatted')}
                      className="h-7 px-2"
                    >
                      <Code2 className="h-3.5 w-3.5 mr-1" />
                      Code
                    </Button>
                  </div>
                )}
                {output && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={downloadXml}
                      className="h-8"
                      title="Download XML"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopy}
                      className="h-8"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          {t('copy')}
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {/* Search and Expand/Collapse for Tree View */}
            {parsedXml && viewMode === 'tree' && (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={tc('searchInJson')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 text-sm rounded-md border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleExpandAll}
                  className="h-9 gap-2"
                  title={expandAll ? 'Collapse All' : 'Expand All'}
                >
                  {expandAll ? (
                    <>
                      <ChevronsUpDown className="h-4 w-4" />
                      Collapse
                    </>
                  ) : (
                    <>
                      <ChevronsDownUp className="h-4 w-4" />
                      Expand
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {error && (
              <div className="flex items-center gap-2 text-destructive mb-4">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            {viewMode === 'tree' && parsedXml ? (
              <div className="border rounded-md bg-muted/30 min-h-[400px] max-h-[600px] overflow-auto">
                <XMLTreeViewer 
                  node={parsedXml} 
                  searchTerm={searchTerm}
                  expandAll={expandAll}
                />
              </div>
            ) : (
              <Textarea
                value={output}
                readOnly
                placeholder={t('outputPlaceholder')}
                className="min-h-[400px] font-mono text-sm"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <div className="mt-8 p-4 bg-muted/30 rounded-lg">
        <h3 className="font-semibold mb-2">💡 {t('aboutTitle')}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t('aboutDescription')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <strong className="block mb-2">{t('features')}:</strong>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>{t('feature1')}</li>
              <li>{t('feature2')}</li>
              <li>{t('feature3')}</li>
              <li>{t('feature4')}</li>
              <li>{t('feature5')}</li>
            </ul>
          </div>

          <div>
            <strong className="block mb-2">{t('useCases')}:</strong>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>{t('useCase1')}</li>
              <li>{t('useCase2')}</li>
              <li>{t('useCase3')}</li>
              <li>{t('useCase4')}</li>
              <li>{t('useCase5')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

