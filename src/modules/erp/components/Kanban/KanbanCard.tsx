"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Project } from "../../types/project";
import { MoreHorizontal, User, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface KanbanCardProps {
  project: Project;
}

export function KanbanCard({ project }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project.id!,
    data: {
      type: "Project",
      project,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="glass p-5 rounded-2xl border-2 border-brass-500/50 opacity-30 h-[140px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="glass p-5 rounded-2xl border-white/5 hover:border-brass-500/30 transition-all cursor-grab active:cursor-grabbing group"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-black text-brass-500/80 uppercase tracking-widest">
            #{project.id?.slice(0, 5).toUpperCase()}
          </span>
          <button className="text-wood-700 group-hover:text-wood-400 transition-colors">
            <MoreHorizontal size={14} />
          </button>
        </div>

        <h4 className="text-md font-bold text-white uppercase tracking-tight leading-tight group-hover:text-brass-500 transition-colors">
          {project.name}
        </h4>

        <div className="flex items-center gap-2 pt-2 text-[10px] uppercase font-bold text-wood-500 font-sans">
          <User size={12} className="text-wood-700" />
          <span className="truncate">{project.customerName}</span>
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-wood-600">
            <Clock size={12} />
            <span className="text-[10px] font-bold">{project.deadline}</span>
          </div>
          <Link href={`/dashboard/projects/${project.id}`} onPointerDown={(e) => e.stopPropagation()}>
            <div className="p-2 bg-wood-950 rounded-lg text-brass-500 hover:bg-brass-500 hover:text-wood-950 transition-all">
              <ArrowRight size={14} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
