'use client';

import * as React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JsonTreeViewerProps {
  data: any;
  name?: string;
  isRoot?: boolean;
  searchTerm?: string;
  expandAll?: boolean;
}

interface JsonNodeProps {
  name: string;
  value: any;
  level: number;
  isLast: boolean;
  searchTerm?: string;
  expandAll?: boolean;
}

function JsonNode({ name, value, level, isLast, searchTerm = '', expandAll = true }: JsonNodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(expandAll);
  
  // Update expansion when expandAll prop changes
  React.useEffect(() => {
    setIsExpanded(expandAll);
  }, [expandAll]);
  const isObject = value !== null && typeof value === 'object' && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const isPrimitive = !isObject && !isArray;
  const isEmpty = (isObject && Object.keys(value).length === 0) || (isArray && value.length === 0);

  const getValueColor = (val: any): string => {
    if (val === null) return 'text-gray-500 dark:text-gray-400';
    if (typeof val === 'string') return 'text-green-600 dark:text-green-400';
    if (typeof val === 'number') return 'text-blue-600 dark:text-blue-400';
    if (typeof val === 'boolean') return 'text-purple-600 dark:text-purple-400';
    return 'text-foreground';
  };

  const formatValue = (val: any): string => {
    if (val === null) return 'null';
    if (typeof val === 'string') return `"${val}"`;
    return String(val);
  };

  const getTypeLabel = (): string => {
    if (isArray) return `Array(${value.length})`;
    if (isObject) return `Object(${Object.keys(value).length})`;
    return '';
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Check if this node or its value matches the search term
  const matchesSearch = React.useMemo(() => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const nameMatches = name.toLowerCase().includes(searchLower);
    const valueMatches = isPrimitive && String(value).toLowerCase().includes(searchLower);
    
    return nameMatches || valueMatches;
  }, [searchTerm, name, value, isPrimitive]);

  // Highlight matching text
  const highlightText = (text: string) => {
    if (!searchTerm || !matchesSearch) return text;
    
    const searchLower = searchTerm.toLowerCase();
    const textLower = text.toLowerCase();
    const index = textLower.indexOf(searchLower);
    
    if (index === -1) return text;
    
    return (
      <>
        {text.slice(0, index)}
        <mark className="bg-yellow-300 dark:bg-yellow-600 text-foreground px-0.5 rounded">
          {text.slice(index, index + searchTerm.length)}
        </mark>
        {text.slice(index + searchTerm.length)}
      </>
    );
  };

  // Don't render if doesn't match search (but render if it's a parent that might have matching children)
  if (searchTerm && !matchesSearch && isPrimitive) {
    return null;
  }

  return (
    <div className="font-mono text-sm">
      <div className={cn(
        "flex items-start hover:bg-accent/50 rounded px-1 -mx-1",
        matchesSearch && searchTerm && "bg-yellow-50 dark:bg-yellow-950/30"
      )}>
        <span style={{ paddingLeft: `${level * 20}px` }} className="inline-flex items-center">
          {(isObject || isArray) && !isEmpty && (
            <button
              onClick={toggleExpand}
              className="mr-1 hover:bg-accent rounded p-0.5 transition-colors"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
          )}
          {(isEmpty || isPrimitive) && <span className="w-[22px]" />}
        </span>

        <span className="flex items-start flex-wrap gap-1">
          {name && (
            <>
              <span className="text-blue-700 dark:text-blue-300 font-medium">
                {highlightText(name)}
              </span>
              <span className="text-muted-foreground">:</span>
            </>
          )}

          {isPrimitive && (
            <>
              <span className={getValueColor(value)}>
                {typeof value === 'string' ? (
                  <>&quot;{highlightText(value)}&quot;</>
                ) : (
                  highlightText(String(value))
                )}
              </span>
              {!isLast && <span className="text-muted-foreground">,</span>}
            </>
          )}

          {(isObject || isArray) && (
            <>
              <span className="text-muted-foreground">
                {isArray ? '[' : '{'}
                {isEmpty && (isArray ? ']' : '}')}
              </span>
              {!isEmpty && (
                <span className="text-muted-foreground text-xs ml-1 opacity-60">
                  {getTypeLabel()}
                </span>
              )}
            </>
          )}
        </span>
      </div>

      {(isObject || isArray) && !isEmpty && isExpanded && (
        <div>
          {isArray
            ? value.map((item: any, index: number) => (
                <JsonNode
                  key={index}
                  name={String(index)}
                  value={item}
                  level={level + 1}
                  isLast={index === value.length - 1}
                  searchTerm={searchTerm}
                  expandAll={expandAll}
                />
              ))
            : Object.entries(value).map(([key, val], index, arr) => (
                <JsonNode
                  key={key}
                  name={key}
                  value={val}
                  level={level + 1}
                  isLast={index === arr.length - 1}
                  searchTerm={searchTerm}
                  expandAll={expandAll}
                />
              ))}
          <div style={{ paddingLeft: `${level * 20}px` }} className="text-muted-foreground">
            {isArray ? ']' : '}'}
            {!isLast && ','}
          </div>
        </div>
      )}
    </div>
  );
}

export function JsonTreeViewer({ 
  data, 
  name, 
  isRoot = true, 
  searchTerm = '', 
  expandAll = true 
}: JsonTreeViewerProps) {
  if (data === undefined) {
    return (
      <div className="text-muted-foreground text-sm p-4">
        No data to display
      </div>
    );
  }

  return (
    <div className="p-4 overflow-auto">
      <JsonNode 
        name={name || ''} 
        value={data} 
        level={0} 
        isLast={true}
        searchTerm={searchTerm}
        expandAll={expandAll}
      />
    </div>
  );
}

