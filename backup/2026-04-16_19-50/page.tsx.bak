"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { projectService } from "@/modules/erp/services/projectService";
import { Project } from "@/modules/erp/types/project";
import { 
  Hammer, 
  Search, 
  Plus, 
  LayoutGrid, 
  Columns, 
  MoreHorizontal,
  Clock,
  User,
  Loader2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const COLUMNS = [
  { id: "Medição", label: "Medição", color: "border-blue-500" },
  { id: "Projeto", label: "Design/Projeto", color: "border-purple-500" },
  { id: "Produção", label: "Em Fabricação", color: "border-orange-500" },
  { id: "Montagem", label: "Montagem/Obra", color: "border-emerald-500" },
  { id: "Concluído", label: "Entrega Final", color: "border-brass-500" },
];

export default function KanbanPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      try {
        const data = await projectService.getAll(user.uid);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  const projectsByColumn = (columnId: string) => {
    return projects.filter(p => p.status === columnId);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-brass-500" size={48} />
        <p className="text-wood-400">Preparando sua linha de produção...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight uppercase px-1 border-l-4 border-brass-500 ml-[-4px]">
            Fluxo de Trabalho
          </h1>
          <p className="text-wood-400 mt-1">Gestão visual e colaborativa da sua marcenaria.</p>
        </div>
        <div className="flex gap-2">
            <Link href="/dashboard/projects">
              <Button variant="secondary" className="border-wood-800 text-wood-500">
                <LayoutGrid size={18} className="mr-2" />
                Ver em Lista
              </Button>
            </Link>
            <Button className="flex items-center gap-2">
              <Plus size={20} />
              Novo Projeto
            </Button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-wood-800">
        <div className="flex gap-6 min-w-[1200px] h-full">
          {COLUMNS.map((col) => (
            <div key={col.id} className="w-80 flex flex-col space-y-4">
              {/* Column Header */}
              <div className={`p-4 bg-white/5 rounded-2xl border-t-4 ${col.color} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">{col.label}</h3>
                  <span className="w-6 h-6 rounded-lg bg-wood-900 border border-white/5 flex items-center justify-center text-[10px] font-bold text-wood-400">
                    {projectsByColumn(col.id).length}
                  </span>
                </div>
                <button className="text-wood-600 hover:text-white transition-colors">
                  <Plus size={16} />
                </button>
              </div>

              {/* Column Cards */}
              <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                <AnimatePresence>
                  {projectsByColumn(col.id).map((project) => (
                    <motion.div
                      key={project.id}
                      layoutId={project.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ y: -4 }}
                      className="glass p-5 rounded-2xl border-white/5 hover:border-brass-500/30 transition-all cursor-pointer group"
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

                         <div className="flex items-center gap-2 pt-2 text-[10px] uppercase font-bold text-wood-500">
                           <User size={12} className="text-wood-700" />
                           <span className="truncate">{project.customerName}</span>
                         </div>

                         <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-wood-600">
                               <Clock size={12} />
                               <span className="text-[10px] font-bold">{project.deadline}</span>
                            </div>
                            <Link href={`/dashboard/projects/${project.id}`}>
                              <div className="p-2 bg-wood-950 rounded-lg text-brass-500 hover:bg-brass-500 hover:text-wood-950 transition-all">
                                <ArrowRight size={14} />
                              </div>
                            </Link>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {projectsByColumn(col.id).length === 0 && (
                  <div className="h-24 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center">
                    <span className="text-[10px] font-bold text-wood-700 uppercase tracking-widest italic">Vazio</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
