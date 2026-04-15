"use client";

import { motion } from "framer-motion";
import { Hammer, UserPlus, Mail, Lock, User, Briefcase, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { useState } from "react";
import { auth, db } from "@/services/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    workshopName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Update Profile Name
      await updateProfile(user, { displayName: formData.name });

      // 3. Create User Document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        workshopName: formData.workshopName,
        role: "admin",
        createdAt: new Date().toISOString(),
      });

      // 4. Create Workshop document (Tenant)
      await setDoc(doc(db, "workshops", `ws_${user.uid}`), {
        name: formData.workshopName,
        ownerId: user.uid,
        createdAt: new Date().toISOString(),
        settings: {
          currency: "BRL",
          premium: true
        }
      });

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Este e-mail já está em uso.");
      } else {
        setError(`Erro: ${err.message || "Erro desconhecido"}. Verifique o console do navegador.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-wood-950">
      {/* Visual Section */}
      <div className="hidden lg:flex relative overflow-hidden items-center justify-center p-12 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070')] bg-cover bg-center">
        <div className="absolute inset-0 bg-wood-950/70 backdrop-blur-[2px]"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center space-y-6 max-w-lg"
        >
          <div className="flex justify-center mb-8">
             <div className="w-20 h-20 bg-brass-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-brass-600/30 rotate-3">
                <Hammer className="text-wood-950" size={40} />
             </div>
          </div>
          <h2 className="text-5xl font-bold text-white tracking-tight leading-tight">
            Comece sua <br /><span className="text-brass-400 font-serif italic">Jornada Mestre</span>
          </h2>
          <p className="text-wood-200 text-xl font-light">
            Junte-se a milhares de marceneiros que transformaram seus processos com o WoodMaster.
          </p>
        </motion.div>
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center p-8 bg-wood-950 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8 my-8"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Criar Nova Conta</h1>
            <p className="text-wood-400">Preencha os dados abaixo para começar seu teste grátis.</p>
          </div>

          <form className="space-y-5" onSubmit={handleRegister}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm"
              >
                <AlertCircle size={20} />
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Seu Nome"
                name="name"
                placeholder="João Silva"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input 
                label="Nome da Marcenaria"
                name="workshopName"
                placeholder="Ex: Marcenaria Elite"
                value={formData.workshopName}
                onChange={handleChange}
                required
              />
            </div>

            <Input 
              label="E-mail de Trabalho"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Senha"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Input 
                label="Confirmar Senha"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-start gap-2 text-[10px] text-wood-500 leading-tight p-2 bg-white/5 rounded-lg border border-white/5">
              <p>Ao se cadastrar, você concorda com nossos <span className="text-brass-500 underline cursor-pointer">Termos de Uso</span> e <span className="text-brass-500 underline cursor-pointer">Política de Privacidade</span>.</p>
            </div>

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <UserPlus size={20} />
              )}
              {loading ? "Criando conta..." : "Criar Minha Oficina"}
            </Button>

            <p className="text-center text-sm text-wood-400">
              Já possui uma conta?{" "}
              <Link href="/auth/login" className="text-brass-500 font-bold hover:text-brass-400 transition-colors">
                Faça login
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
