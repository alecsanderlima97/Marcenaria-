"use client";

import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Hammer,
  DollarSign,
  Loader2,
  ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { projectService } from "@/modules/erp/services/projectService";
import { inventoryService } from "@/modules/erp/services/inventoryService";
import { Project } from "@/modules/erp/types/project";
import { InventoryItem } from "@/modules/erp/types/inventory";
import { FinancialChart } from "./components/FinancialChart";

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      try {
        const [projData, invData] = await Promise.all([
          projectService.getAll(user.uid),
          inventoryService.getAll(user.uid)
        ]);
        setProjects(projData);
        setInventory(invData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const activeProjects = projects.filter(p => p.status !== 'Concluído');
  const criticalInventory = inventory.filter(p => p.stock <= p.minStock);
  const totalRevenue = projects.reduce((acc, curr) => {
    const val = parseFloat(curr.budget.replace(/[^\d]/g, '')) || 0;
    return acc + val;
  }, 0);

  const stats = [
    { label: "Projetos Ativos", value: activeProjects.length.toString().padStart(2, '0'), icon: Hammer, color: "text-brass-500", bg: "bg-brass-500/10" },
    { label: "Em Produção", value: projects.filter(p => p.status === 'Produção').length.toString().padStart(2, '0'), icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Concluídos", value: projects.filter(p => p.status === 'Concluído').length.toString().padStart(2, '0'), icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Faturamento Total", value: `R$ ${(totalRevenue / 100).toLocaleString('pt-BR')}`, icon: DollarSign, color: "text-brass-500", bg: "bg-brass-500/10" },
  ];

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-brass-500" size={48} />
        <p className="text-wood-400 animate-pulse">Organizando sua oficina...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight uppercase px-1 border-l-4 border-brass-500 ml-[-4px]">Dashboard da Oficina</h1>
        <p className="text-wood-400 mt-1">Bem-vindo de volta! Aqui está o resumo das suas operações.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="glass p-6 rounded-[24px] border-white/5 space-y-4 hover:border-brass-500/20 transition-all group">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1 bg-emerald-400/10 px-2 py-1 rounded-full uppercase tracking-widest">
                <TrendingUp size={12} />
                +12%
              </span>
            </div>
            <div>
              <p className="text-wood-500 text-[10px] uppercase font-bold tracking-[1px]">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="glass p-8 rounded-[32px] border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <DollarSign size={120} className="text-brass-500" />
        </div>
        <div className="relative z-10 w-full lg:w-3/4">
          <h3 className="text-xl font-bold text-white px-1 border-l-4 border-brass-500 ml-[-4px] uppercase tracking-tighter">Performance Financeira</h3>
          <p className="text-wood-500 text-xs mt-1 font-bold uppercase tracking-widest">Faturamento mensal bruto (Últimos 6 meses)</p>
          <FinancialChart />
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 glass p-6 rounded-[24px] border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white px-1 border-l-4 border-brass-500 ml-[-4px]">Fila de Produção</h3>
            <Link href="/dashboard/projects/kanban" className="text-[10px] font-bold text-brass-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
              Ver Quadro Visual
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {activeProjects.length > 0 ? activeProjects.slice(0, 5).map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-wood-950/40 rounded-2xl hover:bg-wood-900/60 transition-all cursor-pointer group border border-white/0 hover:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-wood-900 rounded-xl flex items-center justify-center font-bold text-brass-500 border border-white/5">
                    {project.id?.slice(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold group-hover:text-brass-500 transition-colors uppercase tracking-tight">{project.name}</p>
                    <p className="text-[10px] text-wood-600 uppercase tracking-widest mt-0.5">Cliente: {project.customerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-brass-500/10 text-brass-500 rounded-full text-[10px] uppercase font-bold tracking-widest border border-brass-500/20">
                    {project.status}
                  </span>
                  <p className="text-[10px] text-wood-600 mt-1.5 uppercase font-medium">Prazo: {project.deadline}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <p className="text-wood-600 uppercase text-xs font-bold tracking-widest">Nenhum projeto em fila</p>
              </div>
            )}
          </div>
        </div>

        {/* Inventory Alert */}
        <div className="glass p-6 rounded-[24px] border-white/5 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white px-1 border-l-4 border-brass-500 ml-[-4px]">Alertas Críticos</h3>
            <div className="space-y-4">
              {criticalInventory.length > 0 ? criticalInventory.slice(0, 4).map((item) => (
                <div key={item.id} className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex gap-3 group hover:bg-red-500/10 transition-all">
                  <AlertCircle className="text-red-400 shrink-0" size={20} />
                  <div>
                    <p className="text-red-400 text-sm font-bold uppercase tracking-tight">{item.name}</p>
                    <p className="text-[10px] text-red-500/80 uppercase font-medium">Faltam {item.minStock - item.stock} unidades para o estoque ideal.</p>
                  </div>
                </div>
              )) : (
                <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                  <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-500">
                    <CheckCircle size={24} />
                  </div>
                  <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Estoque em dia!</p>
                </div>
              )}
            </div>
          </div>
          <Link href="/dashboard/inventory" className="w-full">
            <button className="w-full py-4 bg-wood-950 text-wood-100 hover:bg-brass-500 hover:text-wood-950 rounded-2xl transition-all text-[10px] uppercase tracking-[2px] font-black border border-white/5 mt-4">
              Gestão de Materiais
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
