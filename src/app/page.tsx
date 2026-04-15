"use client";

import { motion } from "framer-motion";
import { Hammer, LayoutDashboard, Users, Package, Settings, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", desc: "Viso geral da marcenaria" },
    { icon: Hammer, label: "Projetos", desc: "Gesto de ordens de servio" },
    { icon: Package, label: "Estoque", desc: "Controle de chapas e ferragens" },
    { icon: Users, label: "Clientes", desc: "CRM e histórico de pedidos" },
  ];

  return (
    <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070')] bg-cover bg-center overflow-hidden flex items-center justify-center p-6">
      {/* Overlay para contraste */}
      <div className="absolute inset-0 bg-wood-950/80 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Brand & Hero */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brass-500 rounded-lg flex items-center justify-center shadow-lg shadow-brass-500/20">
              <Hammer className="text-wood-950" size={28} />
            </div>
            <h1 className="text-4xl font-bold text-wood-100 tracking-tight">
              Wood<span className="text-brass-500">Master</span>
            </h1>
          </div>
          
          <h2 className="text-5xl font-bold text-white leading-tight">
            A arte da marcenaria, <br />
            <span className="text-wood-400">gerida com precisão.</span>
          </h2>
          
          <p className="text-wood-200 text-lg max-w-md">
            O software de gestão definitivo para marcenarias que buscam excelência, 
            do primeiro corte ao acabamento final.
          </p>

          <Link href="/auth/login" className="px-8 py-4 bg-brass-500 hover:bg-brass-400 text-wood-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-xl shadow-brass-600/20 w-fit">
            Começar Agora
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Right Side: Features/Module Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="glass p-6 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group border-white/5"
            >
              <div className="w-10 h-10 bg-wood-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-brass-500 transition-colors">
                <item.icon className="text-wood-200 group-hover:text-wood-950 transition-colors" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.label}</h3>
              <p className="text-wood-300 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Footer info */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-wood-500 text-sm font-medium tracking-widest uppercase flex items-center gap-4">
        <span>SaaS Scaleble</span>
        <span className="w-1 h-1 bg-wood-500 rounded-full"></span>
        <span>Orquestracs Built</span>
      </div>
    </main>
  );
}
