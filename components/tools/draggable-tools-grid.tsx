'use client';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripHorizontal } from 'lucide-react';
import { ToolCard } from '@/components';
import type { Tool } from '@/types';

interface DraggableToolCardProps {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: (toolId: string) => void;
  onCardClick: (toolId: string) => void;
  dragTitle: string;
}

interface DraggableToolsGridProps {
  tools: Tool[];
  isFavorite: (toolId: string) => boolean;
  onToggleFavorite: (toolId: string) => void;
  onCardClick: (toolId: string) => void;
  onReorder: (ids: string[]) => void;
  dragTitle: string;
}

function DraggableToolCard({ tool, isFavorite, onToggleFavorite, onCardClick, dragTitle }: DraggableToolCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tool.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 50 : 1,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} className="h-full relative group">
      <div
        {...attributes}
        {...listeners}
        className={`absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 cursor-grab active:cursor-grabbing z-30 flex items-center gap-1.5 rounded-full border shadow-sm transition-all duration-300 ${
          isDragging
            ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-110'
            : 'bg-background/95 backdrop-blur text-muted-foreground border-border hover:text-primary hover:border-primary/50 hover:bg-primary/5 opacity-90 group-hover:opacity-100 hover:scale-105'
        }`}
        title={dragTitle}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <GripHorizontal className="w-4 h-4" />
        <span className="text-[10px] font-bold tracking-wider uppercase whitespace-nowrap">{dragTitle}</span>
      </div>

      <div className={`h-full transition-all duration-300 ${isDragging ? 'shadow-2xl rounded-xl ring-2 ring-primary/40 scale-[1.03]' : ''}`}>
        <ToolCard tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} onCardClick={onCardClick} />
      </div>
    </div>
  );
}

export function DraggableToolsGrid({
  tools,
  isFavorite,
  onToggleFavorite,
  onCardClick,
  onReorder,
  dragTitle,
}: DraggableToolsGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tools.findIndex((t) => t.id === active.id);
    const newIndex = tools.findIndex((t) => t.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const newOrderIds = arrayMove(
      tools.map((t) => t.id),
      oldIndex,
      newIndex
    );
    onReorder(newOrderIds);
  };

  return (
    <DndContext id="dashboard-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tools.map((t) => t.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <div
              key={tool.id}
              className="relative animate-in fade-in slide-in-from-bottom-4 group"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
            >
              <DraggableToolCard
                tool={tool}
                isFavorite={isFavorite(tool.id)}
                onToggleFavorite={onToggleFavorite}
                onCardClick={onCardClick}
                dragTitle={dragTitle}
              />
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
