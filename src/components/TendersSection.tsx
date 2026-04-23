/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, Dispatch, SetStateAction, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Gavel, 
  Sparkles, 
  Loader2, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Table,
  ListTodo,
  Mail,
  Copy,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { TenderRecord, TenderType } from '../types';
import { processTender } from '../lib/gemini';

interface TendersSectionProps {
  tenders: TenderRecord[];
  setTenders: Dispatch<SetStateAction<TenderRecord[]>>;
}

export default function TendersSection({ tenders, setTenders }: TendersSectionProps) {
  const [type, setType] = useState<TenderType>('pública');
  const [organization, setOrganization] = useState('');
  const [deadlines, setDeadlines] = useState('');
  const [requirements, setRequirements] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!organization || !deadlines || !requirements) return;

    setIsProcessing(true);
    try {
      const result = await processTender(type, organization, deadlines, requirements);
      const newTender: TenderRecord = {
        id: crypto.randomUUID(),
        type,
        organization,
        deadlines,
        requirements,
        summaryTable: result.summaryTable,
        tasks: result.tasks,
        presentationDraft: result.presentationDraft,
        createdAt: Date.now(),
      };
      setTenders([newTender, ...tenders]);
      setOrganization('');
      setDeadlines('');
      setRequirements('');
      setExpandedId(newTender.id);
    } catch (error) {
      console.error("AI Error:", error);
      alert("Error al analizar la licitación.");
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteTender = (id: string) => {
    setTenders(tenders.filter(t => t.id !== id));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copiado al portapapeles");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Form Section */}
      <section className="space-y-8">
        <div className="bg-white p-8 rounded-2xl border border-[#d0c5b6]/30 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#f0e0cb]/20 rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Building2 size={20} />
            </div>
            <h3 className="text-xl font-serif text-[#2d1b0d]">Análisis de Licitaciones</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/60">Categoría</label>
              <div className="relative group">
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value as TenderType)}
                  className="w-full p-4 bg-[#fdf9f6]/50 border border-[#d0c5b6]/20 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]/20 appearance-none cursor-pointer hover:border-[#74572a]/30 transition-all"
                >
                  <option value="pública">Pública</option>
                  <option value="privada">Privada</option>
                  <option value="subasta">Subasta</option>
                  <option value="otros">Otros</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74572a] pointer-events-none transition-transform group-hover:translate-y-[-40%]" />
              </div>
            </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/60">Organismo Convocante</label>
                <input 
                  type="text" 
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Ej: Ministerio de Justicia"
                  className="w-full p-4 bg-[#fdf9f6] border border-[#d0c5b6]/20 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/60 flex items-center gap-2">
                <Calendar size={12} /> Plazos Clave
              </label>
              <input 
                type="text" 
                value={deadlines}
                onChange={(e) => setDeadlines(e.target.value)}
                placeholder="Ej: Presentación hasta 15/05, Resolución 01/06"
                className="w-full p-4 bg-[#fdf9f6] border border-[#d0c5b6]/20 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]/20"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/60">Requisitos Técnicos y Económicos</label>
              <textarea 
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Pegue aquí los requerimientos principales de los pliegos..."
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
                  Analizando Pliegos...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Procesar Licitación
                </>
              )}
            </button>
          </form>
        </div>

        <div className="p-6 bg-[#f7f3f0] rounded-2xl border border-dashed border-[#d0c5b6] flex gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#74572a] shrink-0 shadow-sm border border-[#d0c5b6]/20">
            <AlertCircle size={18} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#74572a] mb-1">Optimización de Ofertas</p>
            <p className="text-xs text-[#4d463a]/70 leading-relaxed">
              El sistema generará automáticamente un resumen visual, un listado de tareas operativas y un borrador de presentación profesional para aumentar sus posibilidades de éxito.
            </p>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="space-y-6">
        <h3 className="text-xl font-serif text-[#2d1b0d]">Expedientes de Licitación</h3>
        
        <div className="space-y-4">
          {tenders.length > 0 ? (
            tenders.map((tender) => (
              <motion.div 
                key={tender.id}
                layout
                className="bg-white rounded-2xl border border-[#d0c5b6]/30 overflow-hidden shadow-sm"
              >
                <div 
                  className="p-6 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(expandedId === tender.id ? null : tender.id)}
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-stone-50 text-[#2d1b0d] flex items-center justify-center shrink-0 border border-[#d0c5b6]/20">
                      <Gavel size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-bold truncate">{tender.organization}</h4>
                      <p className="text-[10px] uppercase font-bold text-[#74572a]/60 tracking-widest">{tender.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteTender(tender.id); }}
                      className="p-2 text-[#d0c5b6] hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    {expandedId === tender.id ? <ChevronUp size={18} className="text-[#4d463a]/40" /> : <ChevronDown size={18} className="text-[#4d463a]/40" />}
                  </div>
                </div>

                {expandedId === tender.id && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-6 pb-8 border-t border-[#f7f3f0] pt-6 space-y-8"
                  >
                    {/* Summary Table */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded">
                        <Table size={12} /> Resumen de Licitación
                      </div>
                      <div className="bg-[#fdf9f6] p-6 rounded-xl border border-[#d0c5b6]/20 text-sm leading-relaxed text-[#4d463a] whitespace-pre-wrap">
                        {tender.summaryTable}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Tasks List */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-amber-600 bg-amber-50 w-fit px-2 py-0.5 rounded">
                          <ListTodo size={12} /> Tareas Pendientes
                        </div>
                        <div className="space-y-2">
                          {tender.tasks?.map((task, idx) => (
                            <div key={idx} className="flex gap-3 p-3 bg-white border border-[#d0c5b6]/10 rounded-lg shadow-sm">
                              <div className="w-4 h-4 rounded border border-[#d0c5b6] mt-0.5" />
                              <span className="text-xs text-[#4d463a]">{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Email Draft */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded">
                            <Mail size={12} /> Carta de Presentación
                          </div>
                          <button 
                            onClick={() => copyToClipboard(tender.presentationDraft || '')}
                            className="text-[10px] font-bold text-[#74572a] hover:underline flex items-center gap-1"
                          >
                            <Copy size={12} /> Copiar
                          </button>
                        </div>
                        <div className="bg-[#fdf9f6] p-6 rounded-xl border border-[#d0c5b6]/20 text-xs italic font-serif leading-relaxed text-[#1c1b1a] whitespace-pre-wrap">
                          {tender.presentationDraft}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center space-y-4 border-2 border-dashed border-[#d0c5b6]/20 rounded-3xl">
              <Building2 className="mx-auto text-[#d0c5b6]/40" size={48} />
              <p className="text-[#4d463a]/40 text-sm italic">No hay licitaciones en seguimiento.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
