/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, Dispatch, SetStateAction, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Sparkles, 
  Loader2, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Download,
  Calendar,
  Users,
  Gavel,
  History,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { JudicialMinute, ProcedureType } from '../types';
import { processJudicialMinute } from '../lib/gemini';

interface MinutesSectionProps {
  minutes: JudicialMinute[];
  setMinutes: Dispatch<SetStateAction<JudicialMinute[]>>;
}

export default function MinutesSection({ minutes, setMinutes }: MinutesSectionProps) {
  const [procedureType, setProcedureType] = useState<ProcedureType>('civil');
  const [date, setDate] = useState('');
  const [parties, setParties] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!date || !parties || !keyPoints) return;

    setIsProcessing(true);
    try {
      const result = await processJudicialMinute(procedureType, parties, keyPoints);
      const newMinute: JudicialMinute = {
        id: crypto.randomUUID(),
        procedureType,
        date,
        parties,
        keyPoints,
        structuredMinute: result,
        createdAt: Date.now(),
      };
      setMinutes([newMinute, ...minutes]);
      setDate('');
      setParties('');
      setKeyPoints('');
      setExpandedId(newMinute.id);
    } catch (error) {
      console.error("AI Error:", error);
      alert("Error al generar el acta con IA.");
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteMinute = (id: string) => {
    setMinutes(minutes.filter(m => m.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Form Section */}
      <section className="space-y-8">
        <div className="bg-white p-8 rounded-2xl border border-[#d0c5b6]/30 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-stone-100 text-[#2d1b0d] rounded-lg">
              <Gavel size={20} />
            </div>
            <h3 className="text-xl font-serif text-[#2d1b0d]">Registro de Actas Judiciales</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/60">Tipo de Procedimiento</label>
                <div className="relative group">
                  <select 
                    value={procedureType}
                    onChange={(e) => setProcedureType(e.target.value as ProcedureType)}
                    className="w-full p-4 bg-[#fdf9f6]/50 border border-[#d0c5b6]/20 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]/20 appearance-none cursor-pointer transition-all hover:border-[#74572a]/30"
                  >
                    <option value="civil">Civil</option>
                    <option value="penal">Penal</option>
                    <option value="laboral">Laboral</option>
                    <option value="administrativo">Administrativo</option>
                    <option value="otros">Otros</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74572a] pointer-events-none transition-transform group-hover:translate-y-[-40%]" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/60 flex items-center gap-2">
                  <Calendar size={12} /> Fecha de la Vista
                </label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-4 bg-[#fdf9f6] border border-[#d0c5b6]/20 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/60 flex items-center gap-2">
                <Users size={12} /> Partes Implicadas
              </label>
              <input 
                type="text" 
                value={parties}
                onChange={(e) => setParties(e.target.value)}
                placeholder="Ej: Demandante: Juan Pérez vs Demandado: Construcciones S.A."
                className="w-full p-4 bg-[#fdf9f6] border border-[#d0c5b6]/20 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]/20"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/60">Puntos Clave y Decisiones</label>
              <textarea 
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="Resuma los argumentos principales y acuerdos alcanzados..."
                className="w-full min-h-[150px] p-6 bg-[#fdf9f6] border border-[#d0c5b6]/20 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]/20 resize-none leading-relaxed"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-br from-[#2d1b0d] to-[#4a2c16] text-white rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Generando Acta...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generar Acta Estructurada
                </>
              )}
            </button>
          </form>
        </div>

        <div className="p-6 bg-white border border-[#d0c5b6]/30 rounded-2xl flex gap-4 items-center">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1c1b1a] uppercase tracking-widest">IA Judicial Activa</p>
              <p className="text-[10px] text-[#4d463a]/60">Documentos generados según estándares oficiales actuales.</p>
            </div>
        </div>
      </section>

      {/* History Section */}
      <section className="space-y-6">
        <h3 className="text-xl font-serif text-[#2d1b0d] flex items-center gap-3">
          <History size={20} className="text-[#74572a]/40" />
          Archivo de Actas
        </h3>

        <div className="space-y-5">
          {minutes.length > 0 ? (
            minutes.map((minute) => (
              <motion.div 
                key={minute.id}
                layout
                className="bg-white rounded-3xl border border-[#d0c5b6]/20 shadow-sm overflow-hidden"
              >
                <div 
                  className="p-8 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(expandedId === minute.id ? null : minute.id)}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#f7f3f0] flex items-center justify-center text-[#2d1b0d] border border-[#d0c5b6]/20">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-serif">{minute.parties.split('vs')[0].trim()}</h4>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#74572a]/60">
                        {minute.procedureType} • {new Date(minute.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteMinute(minute.id); }}
                      className="p-2 text-[#d0c5b6] hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    {expandedId === minute.id ? <ChevronUp size={20} className="text-[#1c1b1a]/40" /> : <ChevronDown size={20} className="text-[#1c1b1a]/40" />}
                  </div>
                </div>

                {expandedId === minute.id && minute.structuredMinute && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-8 pb-10 space-y-10"
                  >
                    <div className="p-10 bg-[#fdf9f6] border border-[#d0c5b6]/20 rounded-3xl relative">
                      <div className="absolute top-8 right-8 flex gap-2">
                        <button className="p-2 bg-white rounded-lg shadow-sm text-[#4d463a] hover:text-[#74572a] transition-colors"><Download size={16} /></button>
                        <button className="p-2 bg-white rounded-lg shadow-sm text-[#4d463a] hover:text-[#74572a] transition-colors"><Printer size={16} /></button>
                      </div>

                      {/* Result Paper */}
                      <div className="space-y-8 font-serif leading-relaxed">
                        <div className="text-center pb-8 border-b border-[#d0c5b6]/20">
                          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#74572a] mb-2">Acta de Procedimiento</p>
                          <h5 className="text-xl italic">{minute.structuredMinute.header}</h5>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                            <h6 className="text-xs uppercase tracking-widest font-bold text-[#1c1b1a]">Hechos y Comparecencia</h6>
                            <p className="text-sm text-[#4d463a]/80 italic">
                             {minute.structuredMinute.facts}
                            </p>
                          </div>
                          <div className="space-y-4">
                            <h6 className="text-xs uppercase tracking-widest font-bold text-[#1c1b1a]">Alegaciones de las Partes</h6>
                            <p className="text-sm text-[#4d463a]/80">
                              {minute.structuredMinute.allegations}
                            </p>
                          </div>
                        </div>

                        <div className="pt-8 border-t border-[#d0c5b6]/10">
                          <div className="bg-[#f0e0cb]/30 p-8 rounded-2xl border border-[#f0e0cb]">
                            <h6 className="text-[10px] uppercase tracking-widest font-bold text-[#2d1b0d] mb-4">Resoluciones y Acuerdos</h6>
                            <p className="text-sm text-[#2d1b0d] font-bold leading-relaxed">
                              {minute.structuredMinute.decisions}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 bg-[#e5e2df]/20 p-6 rounded-2xl">
                          <div className="w-8 h-8 rounded-full bg-[#74572a] flex items-center justify-center text-white shrink-0"><Calendar size={14} /></div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-[#74572a]">Próximos Pasos & Plazos</p>
                            <p className="text-xs text-[#4d463a] font-medium">{minute.structuredMinute.nextSteps}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="py-24 text-center space-y-6">
              <div className="w-20 h-20 bg-[#f7f3f0] rounded-3xl flex items-center justify-center mx-auto text-[#d0c5b6] animate-pulse">
                <Gavel size={40} />
              </div>
              <div>
                <p className="text-[#1c1b1a]/60 font-serif text-lg">No hay actas registradas.</p>
                <p className="text-[10px] uppercase font-bold text-[#4d463a]/40 tracking-widest mt-1">El archivo está vacío</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
