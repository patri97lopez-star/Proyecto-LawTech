/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Shield, 
  Database, 
  Sparkles, 
  Globe, 
  Bell, 
  Palette,
  ChevronRight,
  Check,
  Smartphone,
  Stamp,
  Save,
  Trash2
} from 'lucide-react';

export default function SettingsSection() {
  const [activeCategory, setActiveCategory] = useState('profile');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const handleSave = () => {
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleImport = () => {
    setImporting(true);
    setImportProgress(0);
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setImporting(false);
          alert('Migración completada con éxito. Se han importado 150 expedientes y 42 clientes.');
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handlePurgeLogs = () => {
    if (confirm('¿Está ABSOLUTAMENTE seguro de purgar el historial de auditoría? Esta acción es irreversible y podría afectar al cumplimiento normativo.')) {
      alert('Historial purgado correctamente.');
    }
  };

  const categories = [
    { id: 'profile', name: 'Perfil Profesional', icon: User },
    { id: 'office', name: 'Datos del Despacho', icon: Stamp },
    { id: 'ai', name: 'Inteligencia Artificial', icon: Sparkles },
    { id: 'privacy', name: 'Seguridad y Privacidad', icon: Shield },
    { id: 'notifs', name: 'Notificaciones', icon: Bell },
    { id: 'data', name: 'Gestión de Datos', icon: Database },
  ];

  return (
    <div className="flex gap-10">
      {/* Settings Navigation */}
      <aside className="w-64 space-y-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-200 text-left
              ${activeCategory === cat.id 
                ? 'bg-[#2d1b0d] text-white shadow-lg' 
                : 'text-[#4d463a]/70 hover:bg-[#ebe7e4] hover:text-[#2d1b0d]'
              }`}
          >
            <cat.icon size={18} />
            <span className="text-sm font-medium">{cat.name}</span>
          </button>
        ))}
      </aside>

      {/* Settings Content */}
      <div className="flex-1 max-w-3xl">
        <div className="bg-white rounded-3xl border border-[#d0c5b6]/30 shadow-sm p-10 min-h-[600px] flex flex-col">
          <div className="flex-1">
            {activeCategory === 'profile' && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <header>
                  <h3 className="text-2xl font-serif text-[#2d1b0d] mb-2">Perfil Profesional</h3>
                  <p className="text-sm text-[#4d463a]/60 font-light">Gestione su identidad dentro de la plataforma LeyFlow.</p>
                </header>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-[#4d463a]/40">Nombre Completo</label>
                    <input type="text" defaultValue="Patricia López" className="w-full bg-[#fdf9f6] border border-[#d0c5b6]/20 p-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-[#4d463a]/40">Número de Colegiado</label>
                    <input type="text" defaultValue="M-345.122" className="w-full bg-[#fdf9f6] border border-[#d0c5b6]/20 p-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-[#4d463a]/40">Correo Electrónico</label>
                    <input type="email" defaultValue="p.lopez@leyflow-legal.com" className="w-full bg-[#fdf9f6] border border-[#d0c5b6]/20 p-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-[#4d463a]/40">Especialidad Principal</label>
                    <select className="w-full bg-[#fdf9f6] border border-[#d0c5b6]/20 p-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]">
                      <option>Derecho Mercantil y Licitaciones</option>
                      <option>Derecho Civil y Procesal</option>
                      <option>Derecho Penal</option>
                      <option>Derecho Administrativo</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#d0c5b6]/20">
                  <button className="flex items-center gap-2 text-xs font-bold text-[#74572a] uppercase tracking-widest hover:underline">
                    Cambiar Contraseña <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {activeCategory === 'ai' && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <header>
                  <h3 className="text-2xl font-serif text-[#2d1b0d] mb-2">Configuración IA</h3>
                  <p className="text-sm text-[#4d463a]/60 font-light">Personalice el comportamiento del asistente inteligente jurídico.</p>
                </header>

                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-[#d0c5b6]/10">
                    <div>
                      <p className="font-semibold text-[#2d1b0d]">Tono de los Borradores</p>
                      <p className="text-xs text-[#4d463a]/60">Ajuste el estilo de lenguaje para las respuestas de correo.</p>
                    </div>
                    <select className="bg-[#fdf9f6] border border-[#d0c5b6]/20 p-2 rounded-lg text-xs font-bold uppercase tracking-wider text-[#74572a]">
                      <option>Muy Formal</option>
                      <option>Directo y Claro</option>
                      <option>Técnico Legal</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-[#d0c5b6]/10">
                    <div>
                      <p className="font-semibold text-[#2d1b0d]">Nivel de Análisis</p>
                      <p className="text-xs text-[#4d463a]/60">Profundidad en la extracción de plazos en correos.</p>
                    </div>
                    <div className="flex bg-[#fdf9f6] p-1 rounded-full border border-[#d0c5b6]/20">
                      <button className="px-3 py-1 rounded-full text-[10px] uppercase font-bold text-[#4d463a]/40 hover:text-[#74572a]">Básico</button>
                      <button className="px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-[#2d1b0d] text-white">Exhaustivo</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-[#d0c5b6]/10">
                    <div>
                      <p className="font-semibold text-[#2d1b0d]">Validación Humana Requerida</p>
                      <p className="text-xs text-[#4d463a]/60">Marcar borradores como "pendientes de revisión" por defecto.</p>
                    </div>
                    <div className="w-12 h-6 bg-[#2d1b0d] rounded-full relative cursor-pointer flex items-center px-1">
                      <div className="absolute right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex gap-3">
                    <Sparkles className="text-amber-600 shrink-0" size={18} />
                    <p className="text-xs text-amber-800 leading-relaxed italic">
                      "Su IA está utilizando el modelo legal optimizado para la jurisdicción española. Los plazos se calculan según el BOE vigente."
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeCategory === 'privacy' && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <header>
                  <h3 className="text-2xl font-serif text-[#2d1b0d] mb-2">Seguridad y Privacidad</h3>
                  <p className="text-sm text-[#4d463a]/60 font-light">Configuración de seguridad de grado jurídico para sus datos.</p>
                </header>

                <div className="space-y-6">
                  <div className="p-5 bg-[#fdf9f6] rounded-2xl border border-[#d0c5b6]/30 group hover:border-[#74572a]/40 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3">
                        <Smartphone className="text-[#4d463a]/40" size={20} />
                        <div>
                          <p className="font-semibold text-sm">Autenticación Biométrica</p>
                          <p className="text-[10px] text-[#4d463a]/60 uppercase tracking-widest mt-1">Nivel de Seguridad: Alto</p>
                        </div>
                      </div>
                      <div className="w-10 h-5 bg-[#d0c5b6]/30 rounded-full flex items-center px-1">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-[#fdf9f6] rounded-2xl border border-[#d0c5b6]/30">
                    <p className="font-semibold text-sm mb-2">Cierre de Sesión Automático</p>
                    <p className="text-xs text-[#4d463a]/60 mb-4">Cierra la aplicación tras un periodo de inactividad.</p>
                    <div className="grid grid-cols-4 gap-2">
                      {['5 min', '15 min', '30 min', 'Nunca'].map(t => (
                        <button key={t} className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${t === '15 min' ? 'bg-[#2d1b0d] text-white border-[#2d1b0d]' : 'bg-white text-[#4d463a]/60 border-[#d0c5b6]/20'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeCategory === 'data' && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <header>
                  <h3 className="text-2xl font-serif text-[#2d1b0d] mb-2">Gestión de Datos y Migración</h3>
                  <p className="text-sm text-[#4d463a]/60 font-light">Importación y exportación masiva para una movilidad de datos total.</p>
                </header>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-[#fdf9f6] rounded-3xl border border-[#d0c5b6]/30 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Globe size={24} />
                    </div>
                    <h4 className="font-bold text-sm">Importación Masiva</h4>
                    <p className="text-[10px] text-[#4d463a]/60 leading-relaxed uppercase tracking-tight font-black">Excel, CSV o JSON</p>
                    <button 
                      disabled={importing}
                      onClick={handleImport}
                      className="w-full py-2 bg-white border border-[#d0c5b6]/40 text-[#74572a] rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-[#ebe7e4] transition-all disabled:opacity-50"
                    >
                      {importing ? `Importando ${importProgress}%` : 'Seleccionar Archivo'}
                    </button>
                    {importing && (
                      <div className="w-full h-1 bg-[#ebe7e4] rounded-full overflow-hidden mt-2">
                        <motion.div 
                          className="h-full bg-emerald-500" 
                          initial={{ width: 0 }}
                          animate={{ width: `${importProgress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-[#fdf9f6] rounded-3xl border border-[#d0c5b6]/30 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Database size={24} />
                    </div>
                    <h4 className="font-bold text-sm">Exportación Total</h4>
                    <p className="text-[10px] text-[#4d463a]/60 leading-relaxed uppercase tracking-tight font-black">Formato nativo Atelier</p>
                    <button 
                      onClick={() => alert('Preparando paquete de exportación cifrado...')}
                      className="w-full py-2 bg-[#2d1b0d] text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-[#4a2c16] transition-all"
                    >
                      Iniciar Exportación
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Trash2 className="text-red-400" size={32} />
                    <div>
                      <p className="text-sm font-bold text-red-900">Limpieza de Auditoría</p>
                      <p className="text-[10px] text-red-400 uppercase tracking-widest font-black">Acción irreversible</p>
                    </div>
                  </div>
                  <button 
                    onClick={handlePurgeLogs}
                    className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                  >
                    Purgar Logs
                  </button>
                </div>
              </motion.div>
            )}
            
            {/* Added a fallback for categories not yet detailed */}
            {(activeCategory === 'office' || activeCategory === 'notifs') && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <Palette className="text-[#d0c5b6]/40" size={64} strokeWidth={1} />
                <p className="font-serif italic text-[#4d463a]/60">Esta sección de ajustes aparecerá en la próxima actualización de LeyFlow.</p>
              </div>
            )}
          </div>

          {/* Save Action */}
          <div className="pt-10 flex justify-end gap-4 border-t border-[#d0c5b6]/20">
            <button className="px-8 py-3 text-sm font-semibold text-[#4d463a]/60 hover:text-[#2d1b0d] transition-colors">
              Descartar
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#74572a] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-[#5e4622] transition-all transform active:scale-95 min-w-[160px] justify-center"
            >
              {saveStatus === 'success' ? (
                <>
                  <Check size={18} />
                  <span>Guardado</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
