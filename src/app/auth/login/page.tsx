"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Hammer, 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  UserPlus,
  User
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { auth } from "@/services/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      // Lógica de Sucesso Estilo "Estética Automotiva"
      setSuccess(true);
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
      
    } catch (err: any) {
      console.error("Auth error:", err);
      setLoading(false);
      
      const errorMessages: Record<string, string> = {
        "auth/user-not-found": "Usuário não encontrado.",
        "auth/wrong-password": "Senha incorreta.",
        "auth/invalid-credential": "Credenciais inválidas.",
        "auth/email-already-in-use": "Este e-mail já está em uso.",
        "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
        "auth/invalid-email": "E-mail inválido."
      };

      setError(errorMessages[err.code] || "Falha na autenticação. Tente novamente.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6 relative overflow-hidden font-sans">
      {/* Background Cinematográfico */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brass-600/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-wood-800/5 blur-[120px] rounded-full"></div>
        {/* Linhas de Textura de Madeira Subtis */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[460px] z-10"
      >
        <div className="glass p-8 md:p-12 rounded-[40px] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          
          {/* Badge de Sucesso (Premium Overlay) */}
          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-wood-950/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-center p-8"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 10, stiffness: 100 }}
                  className="w-24 h-24 bg-gradient-to-br from-brass-400 to-brass-600 rounded-full flex items-center justify-center text-wood-950 mb-8 shadow-[0_0_30px_rgba(196,160,82,0.4)]"
                >
                  <CheckCircle size={56} strokeWidth={2.5} />
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-black text-white mb-3 uppercase tracking-tighter"
                >
                  {isRegister ? "Conta Criada" : "Acesso Autorizado"}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-wood-400 font-medium tracking-wide"
                >
                  Sincronizando sua oficina digital...
                </motion.p>
                <div className="mt-8 w-48 h-1 bg-wood-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                    className="h-full bg-brass-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="inline-flex p-5 bg-gradient-to-br from-brass-400 to-brass-600 rounded-[24px] shadow-2xl shadow-brass-600/20 mb-4"
            >
              <Hammer className="text-wood-950" size={32} />
            </motion.div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              Wood<span className="text-brass-500">Master</span>
            </h1>
            <p className="text-wood-500 text-xs font-bold uppercase tracking-[4px]">
              OrQuestraCS • High-End ERP
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleAuth}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border-l-4 border-red-500 text-red-400 px-5 py-3 rounded-r-xl flex items-center gap-3 text-sm font-medium"
              >
                <AlertCircle size={20} className="shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              {isRegister && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="relative group"
                >
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-wood-600 group-focus-within:text-brass-500 transition-colors" size={20} />
                  <input 
                    type="text"
                    placeholder="Seu Nome Completo"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-5 text-white placeholder:text-wood-700 focus:outline-none focus:ring-4 focus:ring-brass-500/10 focus:border-brass-500/50 transition-all text-sm font-medium"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isRegister}
                  />
                </motion.div>
              )}

              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-wood-600 group-focus-within:text-brass-500 transition-colors" size={20} />
                <input 
                  type="email"
                  placeholder="Seu E-mail Profissional"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-5 text-white placeholder:text-wood-700 focus:outline-none focus:ring-4 focus:ring-brass-500/10 focus:border-brass-500/50 transition-all text-sm font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-wood-600 group-focus-within:text-brass-500 transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua Senha de Acesso"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-14 text-white placeholder:text-wood-700 focus:outline-none focus:ring-4 focus:ring-brass-500/10 focus:border-brass-500/50 transition-all text-sm font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-wood-600 hover:text-wood-400 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button 
              className={`w-full h-16 rounded-2xl text-md font-black uppercase tracking-[2px] mt-6 shadow-2xl transition-all active:scale-[0.98] ${
                isRegister ? 'bg-white text-[#0a0a0a] hover:bg-wood-100' : 'bg-brass-500 text-wood-950 hover:bg-brass-400'
              }`} 
              type="submit" 
              disabled={loading || success}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <div className="flex items-center gap-3">
                  {isRegister ? (
                    <>Criar Conta <UserPlus size={20} /></>
                  ) : (
                    <>Acessar Sistema <LogIn size={20} /></>
                  )}
                </div>
              )}
            </Button>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full h-14 bg-white/5 border border-white/10 text-wood-400 hover:text-white hover:bg-white/10 rounded-2xl text-xs font-bold uppercase tracking-[2px] mt-2 transition-all"
            >
              Entrar em Modo Teste (Visitante)
            </button>
          </form>

          {/* Footer Actions */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <button 
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="text-wood-500 hover:text-brass-500 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              {isRegister ? "Já possui acesso? Faça Login" : "Novo por aqui? Solicite Acesso"}
              <div className="w-4 h-[1px] bg-wood-700"></div>
            </button>
            <p className="text-[10px] text-wood-800 uppercase font-black tracking-[3px] mt-4">
              © 2026 OrQuestraCS
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
