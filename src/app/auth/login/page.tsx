"use client";

import { motion } from "framer-motion";
import { Hammer, LogIn, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useEffect } from "react";
import { auth } from "@/services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const playLoginSound = () => {
    try {
      const audio = new Audio('/login_sound.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => console.log("Som de login ignorado"));
    } catch (e) {
      console.log("Sistema de áudio indisponível");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Lógica de Sucesso (Copidada da Estética Automotiva)
      setSuccess(true);
      playLoginSound();
      
      // Delay de 1.5s para sentir a entrada no sistema
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
      
    } catch (err: any) {
      console.error("Login error:", err);
      setLoading(false);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Credenciais de acesso incorretas.");
      } else {
        setError("Falha na conexão. Verifique sua rede e tente novamente.");
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-wood-950 p-6 relative overflow-hidden">
      {/* Background Decorativo - Premium Wood */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brass-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-wood-800/20 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="glass p-8 md:p-12 rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden">
          {/* Overlay de Sucesso */}
          {success && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-wood-900/90 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="w-20 h-20 bg-brass-500 rounded-full flex items-center justify-center text-wood-950 mb-6"
              >
                <CheckCircle size={48} strokeWidth={3} />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Acesso Autorizado</h2>
              <p className="text-wood-400">Preparando sua oficina digital...</p>
            </motion.div>
          )}

          <div className="text-center space-y-4 mb-10">
            <div className="inline-flex p-4 bg-brass-500 rounded-2xl shadow-xl shadow-brass-600/20 mb-4">
              <Hammer className="text-wood-950" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">WoodMaster <span className="text-brass-500">ERP</span></h1>
            <p className="text-wood-500 text-sm">Sistema Exclusivo de Gestão</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-wood-600 group-focus-within:text-brass-500 transition-colors" size={20} />
                <input 
                  type="email"
                  placeholder="E-mail de acesso"
                  className="w-full bg-wood-900/50 border border-wood-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-wood-700 focus:outline-none focus:ring-2 focus:ring-brass-500/20 focus:border-brass-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-wood-600 group-focus-within:text-brass-500 transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha secreta"
                  className="w-full bg-wood-900/50 border border-wood-800 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-wood-700 focus:outline-none focus:ring-2 focus:ring-brass-500/20 focus:border-brass-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-wood-600 hover:text-wood-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button 
              className="w-full h-14 rounded-2xl text-lg font-bold mt-4" 
              type="submit" 
              disabled={loading || success}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <div className="flex items-center gap-3">
                  Entrar no Sistema <LogIn size={20} />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-12 text-center text-[10px] text-wood-700 uppercase tracking-[2px] font-bold">
            OrQuestraCS • Sistemas Personalizados
          </div>
        </div>
      </motion.div>
    </main>
  );
}
