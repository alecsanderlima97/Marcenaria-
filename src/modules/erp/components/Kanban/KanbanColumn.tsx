"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Project } from "../../types/project";
import { KanbanCard } from "./KanbanCard";
import { Plus } from "lucide-react";

interface KanbanColumnProps {
  id: string;
  label: string;
  color: string;
  projects: Project[];
}

export function KanbanColumn({ id, label, color, projects }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="w-80 flex flex-col space-y-4">
      {/* Column Header */}
      <div className={`p-4 bg-white/5 rounded-2xl border-t-4 ${color} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">{label}</h3>
          <span className="w-6 h-6 rounded-lg bg-wood-900 border border-white/5 flex items-center justify-center text-[10px] font-bold text-wood-400">
            {projects.length}
          </span>
        </div>
        <button className="text-wood-600 hover:text-white transition-colors">
          <Plus size={16} />
        </button>
      </div>

      {/* Column Cards Container - This is where the droppable area is */}
      <div
        ref={setNodeRef}
        className="flex-1 space-y-4 overflow-y-auto pr-2 min-h-[500px]"
      >
        <SortableContext items={projects.map(p => p.id!)} strategy={verticalListSortingStrategy}>
          {projects.map((project) => (
            <KanbanCard key={project.id} project={project} />
          ))}
        </SortableContext>

        {projects.length === 0 && (
          <div className="h-24 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center">
            <span className="text-[10px] font-bold text-wood-700 uppercase tracking-widest italic">Vazio</span>
          </div>
        )}
      </div>
    </div>
  );
}
