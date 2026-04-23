/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  History, 
  Download, 
  Database, 
  Lock, 
  Key, 
  UserPlus,
  RefreshCcw,
  Search,
  CheckCircle2,
  Clock,
  User,
  AlertCircle,
  FileDown,
  Trash2
} from 'lucide-react';
import { AuditLog, UserProfile, UserRole } from '../types';

interface SecuritySectionProps {
  auditLogs: AuditLog[];
  teamMembers: UserProfile[];
  onBackup: () => void;
  onRestore: () => void;
}

export default function SecuritySection({ auditLogs, teamMembers, onBackup, onRestore }: SecuritySectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'team' | 'backup'>('audit');
  const [logSearch, setLogSearch] = useState('');

  const filteredLogs = auditLogs.filter(log => 
    log.details.toLowerCase().includes(logSearch.toLowerCase()) ||
    log.userName.toLowerCase().includes(logSearch.toLowerCase())
  );

  const roleColors: Record<UserRole, string> = {
    socio: 'bg-red-50 text-red-600 border-red-100',
    abogado: 'bg-blue-50 text-blue-600 border-blue-100',
    administrativo: 'bg-amber-50 text-amber-600 border-amber-100',
    lector: 'bg-gray-50 text-gray-500 border-gray-100',
  };

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleBackup = () => {
    setIsBackingUp(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsBackingUp(false);
          setProgress(0);
          onBackup();
        }, 500);
      }
    }, 100);
  };

  const handleRestore = () => {
    setIsRestoring(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsRestoring(false);
          setProgress(0);
          onRestore();
        }, 500);
      }
    }, 100);
  };

  return (
    <div className="space-y-10">
      {/* Progress Overlay */}
      <AnimatePresence>
        {(isBackingUp || isRestoring) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d1b0d]/80 backdrop-blur-sm p-4 text-white"
          >
            <div className="max-w-md w-full bg-[#1c1b1a] p-10 rounded-[3rem] border border-white/10 shadow-2xl text-center space-y-6">
              <RefreshCcw size={48} className="mx-auto text-[#74572a] animate-spin" />
              <div>
                <h3 className="text-xl font-serif italic mb-2">
                  {isBackingUp ? 'Preparando Respaldo Seguro...' : 'Sincronizando Punto de Restauración...'}
                </h3>
                <p className="text-xs text-white/40 uppercase tracking-widest font-bold">No cierre la ventana del Atelier</p>
              </div>
              
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#74572a] to-amber-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[10px] font-mono text-amber-500 font-bold">{progress}% COMPLETADO</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Sub-navigation */}
      <div className="flex gap-4 p-2 bg-[#ebe7e4]/60 rounded-2xl w-fit">
        {[
          { id: 'audit', label: 'Auditoría de Cambios', icon: History },
          { id: 'team', label: 'Gestión de Permisos', icon: Shield },
          { id: 'backup', label: 'Copias de Seguridad', icon: Database },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all
              ${activeSubTab === tab.id ? 'bg-white text-[#74572a] shadow-md' : 'text-[#4d463a]/40 hover:text-[#74572a]'}`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'audit' && (
          <motion.div
            key="audit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-[#d0c5b6]/30 shadow-sm">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4d463a]/30" size={16} />
                <input 
                  type="text" 
                  placeholder="Filtrar registro de auditoría..." 
                  className="w-full pl-10 pr-4 py-2 text-xs bg-[#fdf9f6] border border-[#d0c5b6]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#74572a]"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                />
              </div>
              <button className="flex items-center gap-2 px-6 py-2 bg-[#f7f3f0] text-[#74572a] rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-[#ebe7e4] transition-all">
                <FileDown size={14} /> Exportar Log
              </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-[#d0c5b6]/20 shadow-xl overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-[#f7f3f0]">
                  <tr>
                    <th className="text-left px-8 py-5 text-[9px] uppercase tracking-widest font-bold text-[#4d463a]/40">Usuario</th>
                    <th className="text-left px-8 py-5 text-[9px] uppercase tracking-widest font-bold text-[#4d463a]/40">Acción</th>
                    <th className="text-left px-8 py-5 text-[9px] uppercase tracking-widest font-bold text-[#4d463a]/40">Entidad</th>
                    <th className="text-left px-8 py-5 text-[9px] uppercase tracking-widest font-bold text-[#4d463a]/40">Detalles</th>
                    <th className="text-right px-8 py-5 text-[9px] uppercase tracking-widest font-bold text-[#4d463a]/40">Fecha/Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f7f3f0]">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-[#fdf9f6]/50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#ebe7e4] flex items-center justify-center text-[#74572a]">
                            <User size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#1c1b1a]">{log.userName}</p>
                            <p className="text-[9px] text-[#4d463a]/60 uppercase">{log.userEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
                          log.action === 'delete' ? 'bg-red-50 text-red-500 border-red-100' :
                          log.action === 'create' ? 'bg-green-50 text-green-500 border-green-100' :
                          'bg-blue-50 text-blue-500 border-blue-100'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <p className="text-[10px] font-bold text-[#4d463a]/60 uppercase tracking-tight">{log.entityType}</p>
                      </td>
                      <td className="px-8 py-4 max-w-xs">
                        <p className="text-xs text-[#1c1b1a] line-clamp-1">{log.details}</p>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <p className="text-xs font-mono text-[#4d463a]/40">
                          {new Date(log.createdAt).toLocaleString('es-ES', { timeStyle: 'short', dateStyle: 'short' })}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'team' && (
          <motion.div
            key="team"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {teamMembers.map(member => (
              <div key={member.uid} className="bg-white p-8 rounded-[2.5rem] border border-[#d0c5b6]/20 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                <div className={`absolute top-0 right-0 w-2 h-full ${member.role === 'socio' ? 'bg-red-500' : 'bg-blue-500'}`} />
                <div className="flex items-center gap-4 mb-6">
                  {member.photoURL ? (
                    <img src={member.photoURL} alt={member.displayName} className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-[#ebe7e4] flex items-center justify-center text-[#74572a] shadow-lg border-2 border-white">
                      <User size={32} strokeWidth={1} />
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-serif italic text-[#2d1b0d]">{member.displayName}</h4>
                    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-widest border ${roleColors[member.role]}`}>
                      {member.role}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-xs text-[#4d463a]/60">
                    <CheckCircle2 size={14} className="text-green-500" /> Control total de expedientes
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#4d463a]/60">
                    <CheckCircle2 size={14} className="text-green-500" /> Acceso a facturación
                  </div>
                  <div className={`flex items-center gap-3 text-xs ${member.role === 'lector' ? 'text-red-400' : 'text-[#4d463a]/60'}`}>
                    {member.role === 'lector' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} className="text-green-500" />} 
                    Exportación avanzada
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-[#f7f3f0] text-[#74572a] rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-[#2d1b0d] hover:text-white transition-all">
                    Cambiar Rol
                  </button>
                  <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            <button className="border-2 border-dashed border-[#d0c5b6]/40 rounded-[2.5rem] flex flex-col items-center justify-center p-12 hover:bg-[#f7f3f0]/50 transition-all group">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#d0c5b6] group-hover:scale-110 transition-transform shadow-sm">
                <UserPlus size={32} strokeWidth={1} />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#74572a]">Invitar Colaborador</p>
            </button>
          </motion.div>
        )}

        {activeSubTab === 'backup' && (
          <motion.div
            key="backup"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[3rem] border border-[#d0c5b6]/30 shadow-xl space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-[#74572a]/5 flex items-center justify-center text-[#74572a]">
                  <Download size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-serif italic text-[#2d1b0d] mb-2">Respaldo Completo</h4>
                  <p className="text-sm text-[#4d463a]/60 leading-relaxed font-medium">
                    Descarga encriptada con todos los expedientes, facturas y datos de clientes. 
                    Última copia: <span className="text-[#1c1b1a]">Hace 2 horas</span>
                  </p>
                </div>
                <button 
                  onClick={handleBackup}
                  className="w-full py-4 bg-[#2d1b0d] text-white rounded-2xl text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-[#4a2c16] transition-all"
                >
                  Generar Backup Ahora
                </button>
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-[#d0c5b6]/30 shadow-xl space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <RefreshCcw size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-serif italic text-[#2d1b0d] mb-2">Restauración de Punto</h4>
                  <p className="text-sm text-[#4d463a]/60 leading-relaxed font-medium">
                    Restablece el estado completo del despacho a una fecha anterior en caso de incidente masivo o error crítico.
                  </p>
                </div>
                <button 
                  onClick={handleRestore}
                  className="w-full py-4 bg-amber-50 text-amber-600 border border-amber-200 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-amber-100 transition-all"
                >
                  Restaurar Datos
                </button>
              </div>
            </div>

            <div className="p-8 bg-[#2d1b0d] rounded-3xl text-white flex items-center gap-6 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
               <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                 <Lock className="text-emerald-400" size={28} />
               </div>
               <div>
                  <h5 className="font-bold flex items-center gap-2 mb-1">
                    Protección de Datos Atelier <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Certificada</span>
                  </h5>
                  <p className="text-xs text-white/60 leading-relaxed font-medium">
                    Su información está cifrada mediante AES-256 bits antes de ser distribuida en nuestros servidores de alta disponibilidad.
                  </p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
