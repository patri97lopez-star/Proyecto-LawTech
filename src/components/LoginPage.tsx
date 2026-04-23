/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, ShieldCheck, Zap, UserPlus, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LawTechLogo from './LawTechLogo';

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('Error al iniciar sesión con Google.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setError(null);
    try {
      if (isRegistering) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.code === 'auth/user-not-found' ? 'Usuario no encontrado.' : 
             err.code === 'auth/wrong-password' ? 'Contraseña incorrecta.' : 
             err.code === 'auth/email-already-in-use' ? 'El correo ya está registrado.' :
             'Error al procesar la solicitud.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf9f6] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
      <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-[#74572a]/5 rounded-full blur-[100px]" />
      <div className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] bg-[#2d1b0d]/5 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-[1100px] w-full bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(45,27,13,0.15)] border border-[#d0c5b6]/20 overflow-hidden relative z-10 flex flex-col md:flex-row min-h-[700px]"
      >
        {/* Welcome Section */}
        <div className="md:w-1/2 p-12 lg:p-16 bg-[#1a1a1a] text-white flex flex-col justify-between relative overflow-hidden">
          {/* Custom Logo Background */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div 
              className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=2574")' }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#2d1b0d]/90 to-[#1a1a1a]/95" />
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <LawTechLogo size={600} />
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-12">
              <LawTechLogo size={60} />
              <div>
                <h1 className="text-2xl font-serif italic text-white">LawTech</h1>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#d4af37]/60 font-bold">Atelier Digital</p>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-serif italic mb-6">Excelencia Legal.</h2>
              <div className="space-y-6 text-white/80 leading-relaxed text-sm font-light">
                <p>
                  Automatice sus procesos con la seguridad y precisión que su práctica requiere. 
                  LawTech centraliza su gestión documental con inteligencia artificial de vanguardia.
                </p>
                <p className="font-serif italic text-base text-[#d4af37]">
                  "La tecnología al servicio de la justicia."
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12 pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#d4af37]/60">Seguridad</span>
              <span className="text-[10px] font-medium leading-tight">Cifrado Militar AES-256</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#d4af37]/60">Cumplimiento</span>
              <span className="text-[10px] font-medium leading-tight">Certified Cloud Legal</span>
            </div>
          </div>
        </div>

        {/* Auth Section */}
        <div className="md:w-1/2 p-10 lg:p-14 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#1c1b1a] mb-2">
                {isRegistering ? 'Crear Cuenta' : 'Acceso al Portal'}
              </h3>
              <p className="text-sm text-[#4d463a]/60">
                {isRegistering 
                  ? 'Regístrese para comenzar su experiencia LawTech.' 
                  : 'Inicie sesión para acceder a su entorno de gestión.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#4d463a]/40">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email"
                    required
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-[#f7f3f0] border border-[#d0c5b6]/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#74572a]/20 transition-all font-medium"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#4d463a]/40">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password"
                    required
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-[#f7f3f0] border border-[#d0c5b6]/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#74572a]/20 transition-all font-medium"
                  />
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs text-center font-medium"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-[#2d1b0d] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#4a2c16] transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isRegistering ? <UserPlus size={18} /> : <LogIn size={18} />}
                    {isRegistering ? 'Registrarse Ahora' : 'Entrar al Sistema'}
                  </>
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#d0c5b6]/20"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="bg-white px-4 text-[#4d463a]/40">O continuar con</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-[#d0c5b6]/40 text-[#1c1b1a] py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#f7f3f0] transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              Google Workspace
            </button>

            <div className="text-center">
              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-xs font-bold text-[#74572a] hover:underline uppercase tracking-wide"
              >
                {isRegistering 
                  ? '¿Ya tiene cuenta? Inicie sesión' 
                  : '¿No tiene cuenta? Regístrese aquí'}
              </button>
            </div>

            <div className="pt-6 text-center border-t border-[#d0c5b6]/20">
              <div className="flex justify-center gap-8 mb-6">
                <div className="flex flex-col items-center gap-1 opacity-60">
                  <ShieldCheck size={16} className="text-[#74572a]" />
                  <span className="text-[8px] uppercase tracking-tighter font-bold">RGPD</span>
                </div>
                <div className="flex flex-col items-center gap-1 opacity-60">
                  <Zap size={16} className="text-[#74572a]" />
                  <span className="text-[8px] uppercase tracking-tighter font-bold">IA Ready</span>
                </div>
              </div>
              <p className="text-[9px] text-[#4d463a]/40 font-medium uppercase tracking-widest">
                &copy; {new Date().getFullYear()} LawTech S.L. • V 2.4.0
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
