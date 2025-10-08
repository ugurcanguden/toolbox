'use client';

import * as React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { XMLNode } from '@/lib/xml-utils';

interface XMLTreeViewerProps {
  node: XMLNode;
  searchTerm?: string;
  expandAll?: boolean;
}

interface XMLNodeViewProps {
  node: XMLNode;
  level: number;
  searchTerm?: string;
  expandAll?: boolean;
}

function XMLNodeView({ node, level, searchTerm = '', expandAll = true }: XMLNodeViewProps) {
  const [isExpanded, setIsExpanded] = React.useState(expandAll);
  
  React.useEffect(() => {
    setIsExpanded(expandAll);
  }, [expandAll]);

  const hasChildren = node.children && node.children.length > 0;
  const hasAttributes = node.attributes && Object.keys(node.attributes).length > 0;
  
  // Check if this element has only text content (no element children)
  const hasOnlyTextContent = hasChildren && node.children?.every(child => child.type === 'text');
  const textContent = hasOnlyTextContent ? node.children?.find(child => child.type === 'text')?.text : null;

  const matchesSearch = React.useMemo(() => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const nameMatches = node.name?.toLowerCase().includes(searchLower);
    const textMatches = node.text?.toLowerCase().includes(searchLower);
    const attrMatches = hasAttributes && Object.entries(node.attributes || {}).some(
      ([key, value]) => 
        key.toLowerCase().includes(searchLower) || 
        value.toLowerCase().includes(searchLower)
    );
    
    return nameMatches || textMatches || attrMatches;
  }, [searchTerm, node, hasAttributes]);

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

  if (node.type === 'text') {
    return (
      <div 
        style={{ paddingLeft: `${level * 20}px` }} 
        className="font-mono text-sm text-green-600 dark:text-green-400"
      >
        {highlightText(node.text || '')}
      </div>
    );
  }

  if (node.type === 'comment') {
    return (
      <div 
        style={{ paddingLeft: `${level * 20}px` }} 
        className="font-mono text-sm text-gray-500 dark:text-gray-400 italic"
      >
        &lt;!--{node.text}--&gt;
      </div>
    );
  }

  // If element has only text content, render inline
  if (hasOnlyTextContent && textContent) {
    return (
      <div className="font-mono text-sm">
        <div className={cn(
          "flex items-start hover:bg-accent/50 rounded px-1 -mx-1",
          matchesSearch && searchTerm && "bg-yellow-50 dark:bg-yellow-950/30"
        )}>
          <span style={{ paddingLeft: `${level * 20}px` }} className="inline-flex items-center">
            <span className="w-[22px]" />
          </span>

          <span className="flex items-start flex-wrap gap-1">
            <span className="text-blue-600 dark:text-blue-400">
              &lt;{highlightText(node.name || '')}
            </span>
            
            {hasAttributes && (
              <span className="text-purple-600 dark:text-purple-400">
                {Object.entries(node.attributes || {}).map(([key, value], idx) => (
                  <span key={idx}>
                    {' '}
                    <span className="text-orange-600 dark:text-orange-400">
                      {highlightText(key)}
                    </span>
                    =
                    <span className="text-green-600 dark:text-green-400">
                      &quot;{highlightText(value)}&quot;
                    </span>
                  </span>
                ))}
              </span>
            )}
            
            <span className="text-blue-600 dark:text-blue-400">
              &gt;
            </span>
            <span className="text-green-600 dark:text-green-400">
              {highlightText(textContent)}
            </span>
            <span className="text-blue-600 dark:text-blue-400">
              &lt;/{node.name}&gt;
            </span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="font-mono text-sm">
      <div className={cn(
        "flex items-start hover:bg-accent/50 rounded px-1 -mx-1",
        matchesSearch && searchTerm && "bg-yellow-50 dark:bg-yellow-950/30"
      )}>
        <span style={{ paddingLeft: `${level * 20}px` }} className="inline-flex items-center">
          {hasChildren && !hasOnlyTextContent && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
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
          {(!hasChildren || hasOnlyTextContent) && <span className="w-[22px]" />}
        </span>

        <span className="flex items-start flex-wrap gap-1">
          <span className="text-blue-600 dark:text-blue-400">
            &lt;{highlightText(node.name || '')}
          </span>
          
          {hasAttributes && (
            <span className="text-purple-600 dark:text-purple-400">
              {Object.entries(node.attributes || {}).map(([key, value], idx) => (
                <span key={idx}>
                  {' '}
                  <span className="text-orange-600 dark:text-orange-400">
                    {highlightText(key)}
                  </span>
                  =
                  <span className="text-green-600 dark:text-green-400">
                    &quot;{highlightText(value)}&quot;
                  </span>
                </span>
              ))}
            </span>
          )}
          
          <span className="text-blue-600 dark:text-blue-400">
            &gt;
          </span>
        </span>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children?.map((child, index) => (
            <XMLNodeView
              key={index}
              node={child}
              level={level + 1}
              searchTerm={searchTerm}
              expandAll={expandAll}
            />
          ))}
          <div 
            style={{ paddingLeft: `${level * 20}px` }} 
            className="text-blue-600 dark:text-blue-400"
          >
            &lt;/{node.name}&gt;
          </div>
        </div>
      )}
      
      {!hasChildren && (
        <span className="text-blue-600 dark:text-blue-400">
          {' '}&lt;/{node.name}&gt;
        </span>
      )}
    </div>
  );
}

export function XMLTreeViewer({ 
  node, 
  searchTerm = '', 
  expandAll = true 
}: XMLTreeViewerProps) {
  return (
    <div className="p-4 overflow-auto">
      <XMLNodeView 
        node={node} 
        level={0} 
        searchTerm={searchTerm}
        expandAll={expandAll}
      />
    </div>
  );
}

