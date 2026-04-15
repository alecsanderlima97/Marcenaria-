"use client";

import { ReactNode, useEffect } from "react";
import { 
  Hammer, 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Wallet
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { auth } from "@/services/firebase";
import { signOut } from "firebase/auth";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Hammer, label: "Projetos", href: "/dashboard/projects" },
  { icon: Package, label: "Estoque", href: "/dashboard/inventory" },
  { icon: Users, label: "Clientes", href: "/dashboard/customers" },
  { icon: Wallet, label: "Financeiro", href: "/dashboard/finance" },
  { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirecionamento desativado para modo de teste
  /*
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);
  */

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-wood-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-1 bg-wood-900 rounded-full overflow-hidden">
             <motion.div 
               animate={{ x: [-100, 100] }} 
               transition={{ repeat: Infinity, duration: 1 }} 
               className="w-10 h-full bg-brass-500"
             />
          </div>
          <span className="text-wood-600 text-[10px] uppercase font-bold tracking-[2px]">Autenticando...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#080808] text-wood-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col p-6 space-y-8 z-20">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-brass-400 to-brass-600 rounded-lg flex items-center justify-center shadow-lg shadow-brass-500/20">
            <Hammer className="text-wood-950" size={24} />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter italic">Wood<span className="text-brass-500">Master</span></span>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                pathname === item.href 
                  ? "bg-white/5 text-brass-500 font-bold" 
                  : "text-wood-500 hover:bg-white/5 hover:text-wood-200"
              }`}
            >
              <item.icon size={20} className={pathname === item.href ? "text-brass-500" : "group-hover:text-brass-400"} />
              <span className="text-sm font-bold uppercase tracking-wide">{item.label}</span>
              {pathname === item.href && (
                <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-6 bg-brass-500 rounded-r-full" />
              )}
            </Link>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-4 text-wood-600 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all group font-bold uppercase text-[10px] tracking-[2px]"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          Sair da Conta
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0a0a]/80 backdrop-blur-xl">
          <div className="flex items-center gap-4 bg-white/5 px-5 py-2.5 rounded-2xl w-96 border border-white/5 group focus-within:border-brass-500/30 transition-all">
            <Search className="text-wood-700 group-focus-within:text-brass-500" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar na oficina..." 
              className="bg-transparent border-none focus:outline-none text-xs w-full placeholder:text-wood-700 text-white font-medium"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-wood-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brass-500 rounded-full border-2 border-[#0a0a0a]"></span>
            </button>
            
            <div className="flex items-center gap-4 pl-6 border-l border-white/5">
              <div className="text-right">
                <p className="text-sm font-black text-white uppercase tracking-tight leading-none">{user.displayName || "Mestre Marceneiro"}</p>
                <p className="text-[10px] text-wood-600 uppercase tracking-widest font-black mt-1">Admin</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-wood-800 to-wood-950 flex items-center justify-center border border-white/10 shadow-lg group hover:border-brass-500/30 transition-all">
                 {user.photoURL ? (
                   <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-2xl object-cover" />
                 ) : (
                    <span className="text-brass-500 font-black text-xs uppercase italic">
                      {user.displayName?.slice(0, 2) || user.email?.slice(0, 2)}
                    </span>
                 )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Area */}
        <main className="flex-1 overflow-y-auto p-8 relative scrollbar-hide bg-[#080808]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
