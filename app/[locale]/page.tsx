"use client";

import { useState, useMemo, useEffect, use } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Search, Star, Clock, X } from 'lucide-react';
import { ToolCard } from '@/components';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFavorites, useTools } from '@/hooks';
import type { Tool } from '@/types';

const DraggableToolsGrid = dynamic(
  () => import('@/components/tools/draggable-tools-grid').then((mod) => mod.DraggableToolsGrid),
  { ssr: false }
);

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const t = useTranslations();
  const { locale } = use(params);
  const { favorites, recent, toggleFavorite, addToRecent, clearRecent, isFavorite } = useFavorites();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { tools, categories } = useTools(locale);

  const [orderedToolIds, setOrderedToolIds] = useState<string[]>([]);

  // Load saved order on mount
  useEffect(() => {
    const saved = localStorage.getItem('curiobox-tool-order');
    if (saved) {
      try {
        setOrderedToolIds(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Filter tools
  const filteredTools = useMemo(() => {
    // Determine the base list, sorted by custom order if available
    let orderedList = [...tools];
    if (orderedToolIds.length > 0) {
      orderedList.sort((a, b) => {
        const indexA = orderedToolIds.indexOf(a.id);
        const indexB = orderedToolIds.indexOf(b.id);
        
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return 0;
      });
    }

    return orderedList.filter((tool) => {
      const matchesSearch = 
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, selectedCategory, orderedToolIds]);

  // Favorite tools
  const favoriteTools = useMemo(() => {
    return tools.filter((tool) => favorites.includes(tool.id));
  }, [tools, favorites]);

  // Recent tools
  const recentTools = useMemo(() => {
    return recent.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean) as Tool[];
  }, [tools, recent]);

  const handleReorder = (newOrderIds: string[]) => {
    setOrderedToolIds(newOrderIds);
    localStorage.setItem('curiobox-tool-order', JSON.stringify(newOrderIds));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="relative mb-20 text-center py-16 px-4 sm:py-24 overflow-hidden rounded-[2rem] bg-gradient-to-b from-primary/5 via-background to-background border border-border/50 shadow-sm">
        {/* Decorative background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <Image
            src="/icon.svg"
            alt={t('common.appName')}
            width={96}
            height={96}
            priority
            fetchPriority="high"
            className="mx-auto mb-6 h-20 w-20 sm:h-24 sm:w-24 drop-shadow-lg"
          />
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            {t('common.appName')}
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            {t('common.appDescription')}
          </p>
        </div>
      </div>

      {/* Ad - Top Banner (after hero) */}
      {/* <AdBanner 
        dataAdSlot="1234567890"
        className="max-w-7xl mx-auto mb-12"
      /> */}

      {/* Search & Filter Section */}
      <div className="mb-16 space-y-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              type="text"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg rounded-2xl shadow-sm border-border/50 bg-background/50 backdrop-blur-sm transition-all focus:bg-background focus:shadow-md"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`transition-all duration-200 rounded-full px-5 py-2 ${
                selectedCategory === category.id 
                  ? 'shadow-md scale-105' 
                  : 'hover:border-primary/50 hover:bg-primary/5'
              }`}
            >
              {category.label}
              {category.id === 'all' && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                  selectedCategory === category.id
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-primary/10 text-primary'
                }`}>
                  {tools.length}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {filteredTools.length === tools.length
              ? `${tools.length} tools available`
              : `Showing ${filteredTools.length} of ${tools.length} tools`}
          </p>
        </div>
      </div>

      {/* Ad - After Search/Filter */}
      {/* <AdBanner 
        dataAdSlot="0987654321"
        className="max-w-7xl mx-auto mb-12"
      /> */}

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

      {/* All Tools Grid with DnD */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">{t('common.allTools')}</h2>
        {filteredTools.length > 0 ? (
          <DraggableToolsGrid
            tools={filteredTools}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onCardClick={addToRecent}
            onReorder={handleReorder}
            dragTitle={t('common.dragToSort')}
          />
        ) : (
          <div className="text-center py-12 animate-in fade-in duration-500">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground mb-2">No tools found</p>
            <p className="text-sm text-muted-foreground">Try a different search or category</p>
          </div>
        )}
      </div>

      {/* Ad - Bottom Banner */}
      {/* <AdBanner 
        dataAdSlot="5555555555"
        className="max-w-7xl mx-auto mb-12"
      /> */}
    </div>
  );
}
