"use client";

import { motion } from "framer-motion";
import { Hammer, LogIn, Mail, Lock, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-wood-950">
      {/* Visual Section - Visible on Desktop */}
      <div className="hidden lg:flex relative overflow-hidden items-center justify-center p-12 bg-[url('https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=1974')] bg-cover bg-center">
        <div className="absolute inset-0 bg-wood-950/60 backdrop-blur-[2px]"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center space-y-6 max-w-lg"
        >
          <div className="flex justify-center mb-8">
             <div className="w-20 h-20 bg-brass-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-brass-600/30">
                <Hammer className="text-wood-950" size={40} />
             </div>
          </div>
          <h2 className="text-5xl font-bold text-white tracking-tight">
            Bem-vindo de volta, <span className="text-brass-500">Mestre.</span>
          </h2>
          <p className="text-wood-200 text-xl font-light">
            Sua oficina digital está pronta para mais um dia de grandes criações.
          </p>
        </motion.div>
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center p-8 bg-wood-950">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Acessar Painel</h1>
            <p className="text-wood-400">Insira suas credenciais para continuar.</p>
          </div>

          <form className="space-y-6">
            <Input 
              label="E-mail Corporativo"
              type="email"
              placeholder="seu@email.com"
              className="mt-1"
            />
            <Input 
              label="Sua Senha"
              type="password"
              placeholder="••••••••"
              className="mt-1"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-wood-400 cursor-pointer">
                <input type="checkbox" className="mr-2 accent-brass-500 rounded" />
                Lembrar de mim
              </label>
              <Link href="#" className="text-brass-500 hover:text-brass-400 transition-colors">
                Esqueceu a senha?
              </Link>
            </div>

            <Button className="w-full">
              <LogIn size={20} />
              Entrar na Oficina
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-wood-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-wood-950 text-wood-500">Ou entre com</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="secondary" className="w-full">
              <GitBranch size={20} />
              GitHub
            </Button>
            <Button variant="secondary" className="w-full">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>
          </div>

          <p className="text-center text-wood-400">
            Ainda não tem conta?{" "}
            <Link href="#" className="text-brass-500 font-bold hover:text-brass-400">
              Crie seu perfil experimental
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
