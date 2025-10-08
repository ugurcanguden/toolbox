"use client";

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Search, Star, Clock, X } from 'lucide-react';
import { ToolCard } from '@/components';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks';
import type { Tool } from '@/types';

export default function HomePage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const { favorites, recent, toggleFavorite, addToRecent, clearRecent, isFavorite } = useFavorites();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const tools: Tool[] = useMemo(() => [
    {
      id: 'json-formatter',
      title: t('tools.jsonFormatter.title'),
      description: t('tools.jsonFormatter.description'),
      category: 'formatters',
      icon: 'Braces',
      href: `/${params.locale}/tools/json-formatter`,
    },
    {
      id: 'xml-formatter',
      title: t('tools.xmlFormatter.title'),
      description: t('tools.xmlFormatter.description'),
      category: 'formatters',
      icon: 'FileCode',
      href: `/${params.locale}/tools/xml-formatter`,
    },
    {
      id: 'base64',
      title: t('tools.base64.title'),
      description: t('tools.base64.description'),
      category: 'encoders',
      icon: 'Lock',
      href: `/${params.locale}/tools/base64`,
    },
    {
      id: 'url-encoder',
      title: t('tools.urlEncoder.title'),
      description: t('tools.urlEncoder.description'),
      category: 'encoders',
      icon: 'Link',
      href: `/${params.locale}/tools/url-encoder`,
    },
    {
      id: 'uuid-generator',
      title: t('tools.uuidGenerator.title'),
      description: t('tools.uuidGenerator.description'),
      category: 'generators',
      icon: 'Fingerprint',
      href: `/${params.locale}/tools/uuid-generator`,
    },
    {
      id: 'hash-generator',
      title: t('tools.hashGenerator.title'),
      description: t('tools.hashGenerator.description'),
      category: 'generators',
      icon: 'Shield',
      href: `/${params.locale}/tools/hash-generator`,
    },
    {
      id: 'password-generator',
      title: t('tools.passwordGenerator.title'),
      description: t('tools.passwordGenerator.description'),
      category: 'generators',
      icon: 'Key',
      href: `/${params.locale}/tools/password-generator`,
    },
    {
      id: 'qr-generator',
      title: t('tools.qrGenerator.title'),
      description: t('tools.qrGenerator.description'),
      category: 'utilities',
      icon: 'QrCode',
      href: `/${params.locale}/tools/qr-generator`,
    },
    {
      id: 'color-converter',
      title: t('tools.colorConverter.title'),
      description: t('tools.colorConverter.description'),
      category: 'converters',
      icon: 'Palette',
      href: `/${params.locale}/tools/color-converter`,
    },
    {
      id: 'regex-tester',
      title: t('tools.regexTester.title'),
      description: t('tools.regexTester.description'),
      category: 'text',
      icon: 'Search',
      href: `/${params.locale}/tools/regex-tester`,
    },
    {
      id: 'string-tools',
      title: t('tools.stringTools.title'),
      description: t('tools.stringTools.description'),
      category: 'text',
      icon: 'Type',
      href: `/${params.locale}/tools/string-tools`,
    },
    {
      id: 'text-compare',
      title: t('tools.textCompare.title'),
      description: t('tools.textCompare.description'),
      category: 'text',
      icon: 'FileText',
      href: `/${params.locale}/tools/text-compare`,
    },
    {
      id: 'markdown-preview',
      title: t('tools.markdownPreview.title'),
      description: t('tools.markdownPreview.description'),
      category: 'formatters',
      icon: 'FileCode',
      href: `/${params.locale}/tools/markdown-preview`,
    },
    {
      id: 'jwt-decoder',
      title: t('tools.jwtDecoder.title'),
      description: t('tools.jwtDecoder.description'),
      category: 'encoders',
      icon: 'Key',
      href: `/${params.locale}/tools/jwt-decoder`,
    },
    {
      id: 'timestamp-converter',
      title: t('tools.timestampConverter.title'),
      description: t('tools.timestampConverter.description'),
      category: 'converters',
      icon: 'Clock',
      href: `/${params.locale}/tools/timestamp-converter`,
    },
    {
      id: 'lorem-generator',
      title: t('tools.loremGenerator.title'),
      description: t('tools.loremGenerator.description'),
      category: 'generators',
      icon: 'FileText',
      href: `/${params.locale}/tools/lorem-generator`,
    },
    {
      id: 'case-converter',
      title: t('tools.caseConverter.title'),
      description: t('tools.caseConverter.description'),
      category: 'text',
      icon: 'Type',
      href: `/${params.locale}/tools/case-converter`,
    },
    {
      id: 'html-formatter',
      title: t('tools.htmlFormatter.title'),
      description: t('tools.htmlFormatter.description'),
      category: 'formatters',
      icon: 'Code',
      href: `/${params.locale}/tools/html-formatter`,
    },
    {
      id: 'css-minifier',
      title: t('tools.cssMinifier.title'),
      description: t('tools.cssMinifier.description'),
      category: 'utilities',
      icon: 'Minimize2',
      href: `/${params.locale}/tools/css-minifier`,
    },
    {
      id: 'sql-formatter',
      title: t('tools.sqlFormatter.title'),
      description: t('tools.sqlFormatter.description'),
      category: 'formatters',
      icon: 'Database',
      href: `/${params.locale}/tools/sql-formatter`,
    },
    {
      id: 'image-to-base64',
      title: t('tools.imageToBase64.title'),
      description: t('tools.imageToBase64.description'),
      category: 'converters',
      icon: 'Image',
      href: `/${params.locale}/tools/image-to-base64`,
    },
    {
      id: 'number-base-converter',
      title: t('tools.numberBaseConverter.title'),
      description: t('tools.numberBaseConverter.description'),
      category: 'converters',
      icon: 'Binary',
      href: `/${params.locale}/tools/number-base-converter`,
    },
    {
      id: 'word-counter',
      title: t('tools.wordCounter.title'),
      description: t('tools.wordCounter.description'),
      category: 'text',
      icon: 'FileText',
      href: `/${params.locale}/tools/word-counter`,
    },
    {
      id: 'line-sorter',
      title: t('tools.lineSorter.title'),
      description: t('tools.lineSorter.description'),
      category: 'text',
      icon: 'ArrowDownAZ',
      href: `/${params.locale}/tools/line-sorter`,
    },
    {
      id: 'duplicate-remover',
      title: t('tools.duplicateRemover.title'),
      description: t('tools.duplicateRemover.description'),
      category: 'text',
      icon: 'Trash2',
      href: `/${params.locale}/tools/duplicate-remover`,
    },
    {
      id: 'html-entity-encoder',
      title: t('tools.htmlEntityEncoder.title'),
      description: t('tools.htmlEntityEncoder.description'),
      category: 'encoders',
      icon: 'Code',
      href: `/${params.locale}/tools/html-entity-encoder`,
    },
    {
      id: 'json-to-csv',
      title: t('tools.jsonToCsv.title'),
      description: t('tools.jsonToCsv.description'),
      category: 'converters',
      icon: 'FileSpreadsheet',
      href: `/${params.locale}/tools/json-to-csv`,
    },
    {
      id: 'csv-to-json',
      title: t('tools.csvToJson.title'),
      description: t('tools.csvToJson.description'),
      category: 'converters',
      icon: 'FileJson',
      href: `/${params.locale}/tools/csv-to-json`,
    },
    {
      id: 'yaml-formatter',
      title: t('tools.yamlFormatter.title'),
      description: t('tools.yamlFormatter.description'),
      category: 'formatters',
      icon: 'FileCode',
      href: `/${params.locale}/tools/yaml-formatter`,
    },
    {
      id: 'credit-card-validator',
      title: t('tools.creditCardValidator.title'),
      description: t('tools.creditCardValidator.description'),
      category: 'utilities',
      icon: 'CreditCard',
      href: `/${locale}/tools/credit-card-validator`,
    },
  ], [t, locale, params.locale]);

  // Categories
  const categories = [
    { id: 'all', label: t('common.allTools') },
    { id: 'formatters', label: t('categories.formatters') },
    { id: 'encoders', label: t('categories.encoders') },
    { id: 'generators', label: t('categories.generators') },
    { id: 'converters', label: t('categories.converters') },
    { id: 'text', label: t('categories.text') },
    { id: 'utilities', label: t('categories.utilities') },
  ];

  // Filter tools
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch = 
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, selectedCategory]);

  // Favorite tools
  const favoriteTools = useMemo(() => {
    return tools.filter((tool) => favorites.includes(tool.id));
  }, [tools, favorites]);

  // Recent tools
  const recentTools = useMemo(() => {
    return recent.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean) as Tool[];
  }, [tools, recent]);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          {t('common.appName')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
          {t('common.appDescription')}
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {t('footer.privacy')}
          </span>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="mb-12 space-y-6">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="transition-all"
            >
              {category.label}
              {category.id === 'all' && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-primary-foreground text-primary text-xs font-bold">
                  {tools.length}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {filteredTools.length === tools.length
              ? `${tools.length} tools available`
              : `Showing ${filteredTools.length} of ${tools.length} tools`}
          </p>
        </div>
      </div>

      {/* Favorites Section */}
      {favoriteTools.length > 0 && searchQuery === "" && selectedCategory === "all" && (
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              {t('common.favorites')}
            </h2>
            <span className="text-sm text-muted-foreground">{favoriteTools.length} tools</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
                onCardClick={addToRecent}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Section */}
      {recentTools.length > 0 && searchQuery === "" && selectedCategory === "all" && (
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              {t('common.recent')}
            </h2>
            <Button variant="ghost" size="sm" onClick={clearRecent}>
              <X className="h-4 w-4 mr-2" />
              {t('common.clearRecent')}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTools.slice(0, 6).map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isFavorite={isFavorite(tool.id)}
                onToggleFavorite={toggleFavorite}
                onCardClick={addToRecent}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Tools Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">{t('common.allTools')}</h2>
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, index) => (
              <div
                key={tool.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
              >
                <ToolCard
                  tool={tool}
                  isFavorite={isFavorite(tool.id)}
                  onToggleFavorite={toggleFavorite}
                  onCardClick={addToRecent}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-in fade-in duration-500">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground mb-2">No tools found</p>
            <p className="text-sm text-muted-foreground">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
}

