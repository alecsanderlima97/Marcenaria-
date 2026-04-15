"use client";

import { motion } from "framer-motion";
import { 
  Hammer, 
  Search, 
  Plus, 
  Filter, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  MoreHorizontal,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";

const projects = [
  { 
    id: "WM-5001", 
    name: "Cozinha Minimalista - Ed. Horizonte", 
    customer: "Ricardo Oliveira", 
    status: "Produção", 
    progress: 65,
    budget: "R$ 28.400",
    deadline: "12 Out",
    priority: "Alta"
  },
  { 
    id: "WM-5002", 
    name: "Painel Sala Home Office", 
    customer: "Marina Souza", 
    status: "Projeto", 
    progress: 30,
    budget: "R$ 4.200",
    deadline: "18 Out",
    priority: "Normal"
  },
  { 
    id: "WM-5003", 
    name: "Dormitório Casal Modulado", 
    customer: "Bruno Santos", 
    status: "Medição", 
    progress: 10,
    budget: "R$ 15.100",
    deadline: "25 Out",
    priority: "Urgente"
  },
];

const statusSteps = [
  { label: "Medição", icon: Layers, color: "text-blue-400" },
  { label: "Projeto", icon: Hammer, color: "text-purple-400" },
  { label: "Produção", icon: Clock, color: "text-orange-400" },
  { label: "Montagem", icon: CheckCircle2, color: "text-emerald-400" },
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState("Todos");

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Carteira de Projetos</h1>
          <p className="text-wood-400">Acompanhe o fluxo completo, da medição à entrega final.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="hidden sm:flex border-wood-800 text-wood-400">
            Exportar Relatório
          </Button>
          <Button className="flex items-center gap-2">
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
              <p className="text-xl font-bold text-white">0{Math.floor(Math.random() * 5) + 1}</p>
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
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {["Todos", "Medição", "Projeto", "Produção", "Montagem"].map((s) => (
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
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="glass p-6 rounded-2xl border-white/5 hover:border-brass-500/30 transition-all group relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* ID & Basic Info */}
              <div className="flex items-center gap-4 min-w-[300px]">
                <div className="w-14 h-14 bg-wood-800 rounded-2xl flex flex-col items-center justify-center text-[10px] font-bold text-brass-500">
                   <Layers size={20} className="mb-1" />
                   {project.id}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brass-500 transition-colors">{project.name}</h3>
                  <p className="text-sm text-wood-500">Cliente: <span className="text-wood-300 font-medium">{project.customer}</span></p>
                </div>
              </div>

              {/* Progress Bar Section */}
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                  <span className="text-wood-400">Status: <span className="text-brass-400">{project.status}</span></span>
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
                <button className="p-2 hover:bg-white/5 rounded-lg text-wood-500 hover:text-white transition-all">
                  <MoreHorizontal size={20} />
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
    </div>
  );
}
