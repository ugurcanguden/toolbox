'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Textarea,
  Slider,
  Checkbox,
  Label,
  Input,
  JsonLdTool,
  ToolSeoContent,
  ToolFaqSection,
  PrivacyBadge
} from '@/components';
import { Download, Trash2, QrCode } from 'lucide-react';
import { useParams } from 'next/navigation';

interface QROptions {
  size: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  foregroundColor: string;
  backgroundColor: string;
  includeMargin: boolean;
}

export default function QRGeneratorPage() {
  const t = useTranslations('tools.qrGenerator');
  const tc = useTranslations('common');
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [text, setText] = useState('');
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);
  const [error, setError] = useState('');
  const [options, setOptions] = useState<QROptions>({
    size: 256,
    errorCorrectionLevel: 'M',
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    includeMargin: true,
  });

  const generateQRCode = async () => {
    if (!text.trim()) {
      setQrCodeGenerated(false);
      setError('');
      return;
    }
    
    if (!canvasRef.current) {
      setError('Canvas not ready');
      return;
    }

    try {
      setError('');
      const QRCode = (await import('qrcode')).default;
      
      const canvas = canvasRef.current;
      await QRCode.toCanvas(canvas, text, {
        width: options.size,
        margin: options.includeMargin ? 4 : 0,
        color: {
          dark: options.foregroundColor,
          light: options.backgroundColor,
        },
        errorCorrectionLevel: options.errorCorrectionLevel,
      });
      
      setQrCodeGenerated(true);
    } catch (error) {
      console.error('QR Code generation error:', error);
      setError('Failed to generate QR code. Please check your input.');
      setQrCodeGenerated(false);
    }
  };

  const loadSample = () => {
    setText('https://github.com/your-username/developertools');
  };

  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleDownloadSVG = async () => {
    if (!text.trim()) return;

    try {
      const QRCode = (await import('qrcode')).default;
      
      const svgString = await QRCode.toString(text, {
        type: 'svg',
        width: options.size,
        margin: options.includeMargin ? 4 : 0,
        color: {
          dark: options.foregroundColor,
          light: options.backgroundColor,
        },
        errorCorrectionLevel: options.errorCorrectionLevel,
      });
      
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'qrcode.svg';
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('SVG generation error:', error);
    }
  };

  const handleClear = () => {
    setText('');
    setQrCodeGenerated(false);
    
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  useEffect(() => {
    if (text.trim()) {
      const timer = setTimeout(() => {
        generateQRCode();
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, options]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
            <p className="text-muted-foreground">{t('description')}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <PrivacyBadge />
            <Button onClick={loadSample} variant="outline" size="sm" className="gap-2">
              <QrCode className="h-4 w-4" />
              {tc('sample')}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('input')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm p-2 bg-destructive/10 rounded">
                  <span>{error}</span>
                </div>
              )}
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('inputPlaceholder')}
                className="min-h-[120px] font-mono text-sm"
              />
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={generateQRCode}
                  disabled={!text.trim()}
                  className="w-full"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  {t('generate')}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClear}
                  disabled={!text}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('clear')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('settings')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>{t('size')}</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {options.size}px
                  </span>
                </div>
                <Slider
                  value={[options.size]}
                  onValueChange={([value]: number[]) => setOptions({ ...options, size: value })}
                  min={128}
                  max={512}
                  step={32}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('errorCorrection')}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                    <Button
                      key={level}
                      variant={options.errorCorrectionLevel === level ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setOptions({ ...options, errorCorrectionLevel: level })}
                      className="text-xs"
                    >
                      {t(`errorCorrection${level === 'L' ? 'Low' : level === 'M' ? 'Medium' : level === 'Q' ? 'Quartile' : 'High'}`)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="foreground">{t('foregroundColor')}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="foreground"
                      type="color"
                      value={options.foregroundColor}
                      onChange={(e) => setOptions({ ...options, foregroundColor: e.target.value })}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={options.foregroundColor}
                      onChange={(e) => setOptions({ ...options, foregroundColor: e.target.value })}
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background">{t('backgroundColor')}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="background"
                      type="color"
                      value={options.backgroundColor}
                      onChange={(e) => setOptions({ ...options, backgroundColor: e.target.value })}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={options.backgroundColor}
                      onChange={(e) => setOptions({ ...options, backgroundColor: e.target.value })}
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeMargin"
                  checked={options.includeMargin}
                  onCheckedChange={(checked) => 
                    setOptions({ ...options, includeMargin: checked as boolean })
                  }
                />
                <Label htmlFor="includeMargin" className="font-normal cursor-pointer">
                  {t('includeMargin')}
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('preview')}</CardTitle>
                {qrCodeGenerated && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadPNG}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      PNG
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadSVG}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      SVG
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center min-h-[300px] bg-muted/30 rounded-lg p-8">
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    className={`max-w-full h-auto border border-border rounded ${
                      qrCodeGenerated ? 'block' : 'hidden'
                    }`}
                  />
                  {!qrCodeGenerated && (
                    <div className="text-center text-muted-foreground">
                      <QrCode className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p className="text-sm">{t('noQRCode')}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <ToolSeoContent toolId="qrGenerator" />
          <ToolFaqSection toolId="qrGenerator" />
        </div>
      </div>

      <JsonLdTool 
        locale={locale}
        tool={{
          id: 'qr-generator',
          title: t('title'),
          description: t('description'),
          category: 'utilities'
        }}
      />
    </div>
  );
}
