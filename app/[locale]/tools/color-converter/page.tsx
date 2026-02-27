'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label
} from '@/components/ui';
import { Copy, Check, Palette } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks';
import { useParams } from "next/navigation";
import { 
  ToolSeoContent, 
  ToolFaqSection, 
  JsonLdTool,
  PrivacyBadge 
} from "@/components";
import {
  hexToRgb,
  rgbToHsl,
  rgbToHsv,
  rgbToCmyk,
  lightenColor,
  darkenColor,
  getComplementaryColor,
  getAnalogousColors,
  getTriadicColors,
  parseColor,
  type RGB,
  type HSL,
  type HSV,
  type CMYK
} from '@/lib';

// Popular color palette
const COLOR_PALETTE = [
  // Reds
  '#EF4444', '#DC2626', '#B91C1C', '#991B1B',
  // Oranges
  '#F97316', '#EA580C', '#C2410C', '#9A3412',
  // Yellows
  '#FACC15', '#EAB308', '#CA8A04', '#A16207',
  // Greens
  '#10B981', '#059669', '#047857', '#065F46',
  // Teals
  '#14B8A6', '#0D9488', '#0F766E', '#115E59',
  // Blues
  '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF',
  // Indigos
  '#6366F1', '#4F46E5', '#4338CA', '#3730A3',
  // Purples
  '#A855F7', '#9333EA', '#7E22CE', '#6B21A8',
  // Pinks
  '#EC4899', '#DB2777', '#BE185D', '#9D174D',
  // Grays
  '#6B7280', '#4B5563', '#374151', '#1F2937',
];

export default function ColorConverterPage() {
  const t = useTranslations('tools.colorConverter');
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { copy } = useCopyToClipboard();
  
  const [currentColor, setCurrentColor] = useState('#3B82F6');
  const [inputValue, setInputValue] = useState('#3B82F6');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const rgb: RGB = hexToRgb(currentColor) || { r: 0, g: 0, b: 0 };
  const hsl: HSL = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv: HSV = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const cmyk: CMYK = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    setInputValue(color);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const parsed = parseColor(value);
    if (parsed) {
      setCurrentColor(parsed);
    }
  };

  const handleCopy = async (text: string, format: string) => {
    await copy(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // Generate color shades
  const shades = [
    { label: '10%', color: lightenColor(currentColor, 40) },
    { label: '20%', color: lightenColor(currentColor, 30) },
    { label: '30%', color: lightenColor(currentColor, 20) },
    { label: '40%', color: lightenColor(currentColor, 10) },
    { label: '50%', color: currentColor },
    { label: '60%', color: darkenColor(currentColor, 10) },
    { label: '70%', color: darkenColor(currentColor, 20) },
    { label: '80%', color: darkenColor(currentColor, 30) },
    { label: '90%', color: darkenColor(currentColor, 40) },
  ];

  const complementary = getComplementaryColor(currentColor);
  const [analogous1, analogous2] = getAnalogousColors(currentColor);
  const [triadic1, triadic2] = getTriadicColors(currentColor);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">{t('description')}</p>
        </div>
        <PrivacyBadge />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Picker & Preview */}
        <div className="space-y-6">
          {/* Color Picker */}
          <Card>
            <CardHeader>
              <CardTitle>{t('colorPicker')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Color Preview */}
              <div
                className="w-full h-40 rounded-lg border-2 border-border shadow-inner transition-colors"
                style={{ backgroundColor: currentColor }}
              />

              {/* Native Color Picker */}
              <div className="flex gap-4">
                <Input
                  type="color"
                  value={currentColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-20 h-12 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={t('hexPlaceholder')}
                  className="flex-1 font-mono"
                />
              </div>

              {/* Color Palette */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Quick Color Palette</Label>
                <div className="grid grid-cols-8 gap-2">
                  {COLOR_PALETTE.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleColorChange(color)}
                      className={`w-full aspect-square rounded-md border-2 transition-all hover:scale-110 hover:shadow-lg ${
                        currentColor.toUpperCase() === color.toUpperCase()
                          ? 'border-primary ring-2 ring-primary/50'
                          : 'border-transparent hover:border-border'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Shades */}
          <Card>
            <CardHeader>
              <CardTitle>{t('colorShades')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-9 gap-2">
                {shades.map((shade) => (
                  <div
                    key={shade.label}
                    className="group relative aspect-square rounded cursor-pointer border border-border hover:border-primary transition-all hover:scale-110"
                    style={{ backgroundColor: shade.color }}
                    onClick={() => handleColorChange(shade.color)}
                    title={shade.color}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[8px] font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                        {shade.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Color Harmonies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                {t('complementary')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Complementary */}
              <div>
                <Label className="text-sm mb-2 block">{t('complementary')}</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className="h-16 rounded border border-border cursor-pointer hover:border-primary transition-all"
                    style={{ backgroundColor: currentColor }}
                    onClick={() => handleColorChange(currentColor)}
                    title={currentColor}
                  />
                  <div
                    className="h-16 rounded border border-border cursor-pointer hover:border-primary transition-all"
                    style={{ backgroundColor: complementary }}
                    onClick={() => handleColorChange(complementary)}
                    title={complementary}
                  />
                </div>
              </div>

              {/* Analogous */}
              <div>
                <Label className="text-sm mb-2 block">{t('analogous')}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div
                    className="h-16 rounded border border-border cursor-pointer hover:border-primary transition-all"
                    style={{ backgroundColor: analogous1 }}
                    onClick={() => handleColorChange(analogous1)}
                    title={analogous1}
                  />
                  <div
                    className="h-16 rounded border border-border cursor-pointer hover:border-primary transition-all"
                    style={{ backgroundColor: currentColor }}
                    onClick={() => handleColorChange(currentColor)}
                    title={currentColor}
                  />
                  <div
                    className="h-16 rounded border border-border cursor-pointer hover:border-primary transition-all"
                    style={{ backgroundColor: analogous2 }}
                    onClick={() => handleColorChange(analogous2)}
                    title={analogous2}
                  />
                </div>
              </div>

              {/* Triadic */}
              <div>
                <Label className="text-sm mb-2 block">{t('triadic')}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div
                    className="h-16 rounded border border-border cursor-pointer hover:border-primary transition-all"
                    style={{ backgroundColor: currentColor }}
                    onClick={() => handleColorChange(currentColor)}
                    title={currentColor}
                  />
                  <div
                    className="h-16 rounded border border-border cursor-pointer hover:border-primary transition-all"
                    style={{ backgroundColor: triadic1 }}
                    onClick={() => handleColorChange(triadic1)}
                    title={triadic1}
                  />
                  <div
                    className="h-16 rounded border border-border cursor-pointer hover:border-primary transition-all"
                    style={{ backgroundColor: triadic2 }}
                    onClick={() => handleColorChange(triadic2)}
                    title={triadic2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Color Formats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('formats')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* HEX */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">{t('hex')}</Label>
                  <span className="text-xs text-muted-foreground">{t('hexDescription')}</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={currentColor}
                    readOnly
                    className="flex-1 font-mono bg-muted"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(currentColor, 'hex')}
                  >
                    {copiedFormat === 'hex' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Check className="w-4 h-4 opacity-0" />
                    )}
                  </Button>
                </div>
              </div>

              {/* RGB */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">{t('rgb')}</Label>
                  <span className="text-xs text-muted-foreground">{t('rgbDescription')}</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                    readOnly
                    className="flex-1 font-mono bg-muted"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
                  >
                    {copiedFormat === 'rgb' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Check className="w-4 h-4 opacity-0" />
                    )}
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-red-100 dark:bg-red-950/30 p-2 rounded text-center">
                    <div className="text-xs text-muted-foreground">{t('red')}</div>
                    <div className="font-mono font-semibold">{rgb.r}</div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-950/30 p-2 rounded text-center">
                    <div className="text-xs text-muted-foreground">{t('green')}</div>
                    <div className="font-mono font-semibold">{rgb.g}</div>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-950/30 p-2 rounded text-center">
                    <div className="text-xs text-muted-foreground">{t('blue')}</div>
                    <div className="font-mono font-semibold">{rgb.b}</div>
                  </div>
                </div>
              </div>

              {/* HSL */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">{t('hsl')}</Label>
                  <span className="text-xs text-muted-foreground">{t('hslDescription')}</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                    readOnly
                    className="flex-1 font-mono bg-muted"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
                  >
                    {copiedFormat === 'hsl' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Check className="w-4 h-4 opacity-0" />
                    )}
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-purple-100 dark:bg-purple-950/30 p-2 rounded text-center">
                    <div className="text-xs text-muted-foreground">{t('hue')}</div>
                    <div className="font-mono font-semibold">{hsl.h}°</div>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-950/30 p-2 rounded text-center">
                    <div className="text-xs text-muted-foreground">{t('saturation')}</div>
                    <div className="font-mono font-semibold">{hsl.s}%</div>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-950/30 p-2 rounded text-center">
                    <div className="text-xs text-muted-foreground">{t('lightness')}</div>
                    <div className="font-mono font-semibold">{hsl.l}%</div>
                  </div>
                </div>
              </div>

              {/* HSV */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">{t('hsv')}</Label>
                  <span className="text-xs text-muted-foreground">{t('hsvDescription')}</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`}
                    readOnly
                    className="flex-1 font-mono bg-muted"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`, 'hsv')}
                  >
                    {copiedFormat === 'hsv' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Check className="w-4 h-4 opacity-0" />
                    )}
                  </Button>
                </div>
              </div>

              {/* CMYK */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">{t('cmyk')}</Label>
                  <span className="text-xs text-muted-foreground">{t('cmykDescription')}</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`}
                    readOnly
                    className="flex-1 font-mono bg-muted"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, 'cmyk')}
                  >
                    {copiedFormat === 'cmyk' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Check className="w-4 h-4 opacity-0" />
                    )}
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="bg-cyan-100 dark:bg-cyan-950/30 p-2 rounded text-center">
                    <div className="text-xs text-muted-foreground">{t('cyan')}</div>
                    <div className="font-mono font-semibold">{cmyk.c}%</div>
                  </div>
                  <div className="bg-pink-100 dark:bg-pink-950/30 p-2 rounded text-center">
                    <div className="text-xs text-muted-foreground">{t('magenta')}</div>
                    <div className="font-mono font-semibold">{cmyk.m}%</div>
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-950/30 p-2 rounded text-center">
                    <div className="text-xs text-muted-foreground">{t('yellow')}</div>
                    <div className="font-mono font-semibold">{cmyk.y}%</div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-950/30 p-2 rounded text-center">
                    <div className="text-xs text-muted-foreground">{t('black')}</div>
                    <div className="font-mono font-semibold">{cmyk.k}%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        <ToolSeoContent toolId="colorConverter" />
        <ToolFaqSection toolId="colorConverter" />
      </div>

      <JsonLdTool
        locale={locale}
        tool={{
          id: "color-converter",
          title: t('title'),
          description: t('description'),
          category: "converters"
        }}
      />
    </div>
  );
}
