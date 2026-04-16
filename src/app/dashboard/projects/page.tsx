"use client";

import { motion } from "framer-motion";
import { 
  Hammer, 
  Search, 
  Plus, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  MoreHorizontal,
  Loader2,
  Calculator,
  Columns,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { projectService } from "@/modules/erp/services/projectService";
import { Project } from "@/modules/erp/types/project";
import { AddProjectModal } from "@/modules/erp/components/AddProjectModal";
import { pdfGenerator } from "@/utils/pdfGenerator";
import { customerService } from "@/modules/erp/services/customerService";

const statusSteps = [
  { label: "Medição", icon: Layers, color: "text-blue-400" },
  { label: "Projeto", icon: Hammer, color: "text-purple-400" },
  { label: "Produção", icon: Clock, color: "text-orange-400" },
  { label: "Montagem", icon: CheckCircle2, color: "text-emerald-400" },
];

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "Todos" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      <AddProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProjects}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Carteira de Projetos</h1>
          <p className="text-wood-400">Acompanhe o fluxo completo, da medição à entrega final.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/projects/kanban">
            <Button variant="secondary" className="hidden sm:flex border-wood-800 text-wood-100 text-sm">
              <Columns size={18} className="mr-2 text-brass-500" />
              Quadro Kanban
            </Button>
          </Link>
          <Link href="/dashboard/projects/new-quote">
            <Button variant="secondary" className="hidden sm:flex border-wood-800 text-wood-100 text-sm">
              <Calculator size={18} className="mr-2 text-brass-500" />
              Gerar Orçamento
            </Button>
          </Link>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} />
            Novo Projeto
          </Button>
        </div>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusSteps.map((step) => (
          <div key={step.label} className="glass p-4 rounded-2xl border-white/5 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-white/5 ${step.color}`}>
              <step.icon size={22} />
            </div>
            <div>
              <p className="text-xs text-wood-500 uppercase font-bold tracking-tighter">{step.label}</p>
              <p className="text-xl font-bold text-white">
                {projects.filter(p => p.status === step.label).length.toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 bg-wood-900/50 px-4 py-3 rounded-xl border border-wood-800">
          <Search className="text-wood-500" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome do projeto ou cliente..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full text-white placeholder:text-wood-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {["Todos", "Medição", "Projeto", "Produção", "Montagem", "Concluído"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                filter === s ? "bg-brass-500 text-wood-950" : "bg-wood-900 text-wood-400 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 glass rounded-3xl">
          <Loader2 className="animate-spin text-brass-500" size={48} />
          <p className="text-wood-500 animate-pulse">Sincronizando pipeline...</p>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="glass p-6 rounded-2xl border-white/5 hover:border-brass-500/30 transition-all group relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* ID & Basic Info */}
                <div className="flex items-center gap-4 min-w-[300px]">
                  <div className="w-14 h-14 bg-wood-800 rounded-2xl flex flex-col items-center justify-center text-[10px] font-bold text-brass-500">
                     <Layers size={20} className="mb-1" />
                     {project.id?.slice(0, 5).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-brass-500 transition-colors uppercase tracking-tight">{project.name}</h3>
                    <p className="text-sm text-wood-500">Cliente: <span className="text-wood-300 font-medium">{project.customerName}</span></p>
                  </div>
                </div>

                {/* Progress Bar Section */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-wood-400">Etapa: <span className="text-brass-400">{project.status}</span></span>
                    <span className="text-wood-300">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-wood-900 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        project.progress > 80 ? 'bg-emerald-500' : 
                        project.progress > 40 ? 'bg-brass-500' : 'bg-blue-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Budget & Deadline */}
                <div className="grid grid-cols-2 lg:flex items-center gap-8 lg:px-8 lg:border-l lg:border-wood-900">
                  <div className="text-center lg:text-left">
                    <p className="text-[10px] text-wood-500 font-bold uppercase tracking-widest">Orçamento</p>
                    <p className="text-md font-bold text-white">{project.budget}</p>
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-[10px] text-wood-500 font-bold uppercase tracking-widest">Entrega</p>
                    <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                      <Calendar size={14} className="text-brass-500" />
                      <span className="text-sm font-bold text-white">{project.deadline}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 border-t lg:border-t-0 pt-4 lg:pt-0 lg:pl-6 lg:border-l lg:border-wood-900">
                  <button 
                    onClick={async () => {
                      if (!user) return;
                      const client = await customerService.getById(user.uid, project.customerId);
                      pdfGenerator.generateProjectOS(project, client);
                    }}
                    className="p-2 hover:bg-white/5 rounded-lg text-brass-500 hover:text-brass-400 transition-all title='Gerar O.S.'"
                  >
                    <Download size={20} />
                  </button>
                  <Link href={`/dashboard/projects/${project.id}`} className="flex items-center gap-2 px-4 py-2 bg-wood-900 hover:bg-brass-500 hover:text-wood-950 text-wood-100 rounded-xl text-sm font-bold transition-all">
                    Detalhes
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-3xl border-dashed border-white/10">
          <div className="inline-flex p-6 bg-wood-900/50 rounded-full mb-6">
             <Hammer className="text-wood-700" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Sem projetos ativos</h3>
          <p className="text-wood-500 mb-8">Nenhum projeto encontrado para o filtro selecionado.</p>
          <Button variant="secondary" className="px-10" onClick={() => setIsModalOpen(true)}>Iniciar Novo Projeto</Button>
        </div>
      )}
    </div>
  );
}
