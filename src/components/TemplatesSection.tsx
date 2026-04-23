/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Search, 
  Plus, 
  Copy, 
  Trash2, 
  Edit3, 
  Layout,
  Mail,
  Gavel,
  Receipt,
  FileBox,
  Library,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { LegalTemplate } from '../types';

interface TemplatesSectionProps {
  templates: LegalTemplate[];
  onAdd: (template: any) => void;
  onUpdate: (id: string, template: any) => void;
  onDelete: (id: string) => void;
}

export default function TemplatesSection({ templates, onAdd, onUpdate, onDelete }: TemplatesSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<LegalTemplate['type'] | 'all'>('all');
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || t.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories: { id: LegalTemplate['type'] | 'all', label: string, icon: any }[] = [
    { id: 'all', label: 'Todas', icon: Library },
    { id: 'email', label: 'Correos', icon: Mail },
    { id: 'demanda', label: 'Demandas', icon: Gavel },
    { id: 'minuta', label: 'Minutas', icon: FileText },
    { id: 'burofax', label: 'Burofaxes', icon: FileBox },
    { id: 'factura', label: 'Facturas', icon: Receipt },
    { id: 'escrito', label: 'Escritos', icon: Layout },
  ];

  return (
    <div className="space-y-10">
      {/* Category Icons Navigation */}
      <div className="flex gap-4 p-4 bg-white rounded-[2.5rem] border border-[#d0c5b6]/30 shadow-sm overflow-x-auto no-scrollbar scroll-smooth">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex flex-col items-center gap-3 px-6 py-4 rounded-[2rem] transition-all min-w-[100px]
              ${activeCategory === cat.id 
                ? 'bg-[#2d1b0d] text-white shadow-xl scale-105' 
                : 'text-[#4d463a]/60 hover:bg-[#f7f3f0] hover:text-[#74572a]'}`}
          >
            <cat.icon size={24} className={activeCategory === cat.id ? 'text-white' : 'text-[#8c857d]'} strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Templates Sidebar/List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4d463a]/30" size={18} />
            <input 
              type="text" 
              placeholder="Buscar plantilla..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-[#d0c5b6]/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#74572a]/20 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            {filteredTemplates.map(template => (
              <motion.button
                key={template.id}
                onClick={() => setIsEditing(template.id)}
                className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between group
                  ${isEditing === template.id 
                    ? 'bg-[#2d1b0d] text-white border-transparent shadow-lg' 
                    : 'bg-white border-[#d0c5b6]/20 hover:border-[#74572a]/40 shadow-sm'}`}
              >
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold truncate mb-0.5">{template.title}</h4>
                  <p className={`text-[10px] uppercase font-bold tracking-tighter truncate ${isEditing === template.id ? 'text-white/40' : 'text-[#4d463a]/40'}`}>
                    {template.description}
                  </p>
                </div>
                <ChevronRight size={16} className={`shrink-0 transition-transform ${isEditing === template.id ? 'text-white translate-x-1' : 'text-[#d0c5b6]'}`} />
              </motion.button>
            ))}
            <button className="w-full p-5 rounded-2xl border border-dashed border-[#d0c5b6] text-[#74572a] text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#74572a]/5 transition-all">
              <Plus size={18} /> Nueva Plantilla
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key={isEditing}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[3rem] border border-[#d0c5b6]/30 shadow-xl overflow-hidden flex flex-col min-h-[600px]"
              >
                <div className="p-10 border-b border-[#f7f3f0] flex justify-between items-center bg-[#fdf9f6]/30">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#2d1b0d] flex items-center justify-center text-white shadow-lg">
                      <Edit3 size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif italic text-[#2d1b0d]">Editor de Plantilla</h3>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#4d463a]/60 font-bold mt-1">Biblioteca Digital LeyFlow</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="p-3 bg-white text-[#4d463a] rounded-xl border border-[#d0c5b6]/30 hover:text-red-500 transition-colors shadow-sm">
                      <Trash2 size={18} />
                    </button>
                    <button className="p-3 bg-white text-[#4d463a] rounded-xl border border-[#d0c5b6]/30 hover:text-[#74572a] transition-colors shadow-sm">
                      <Copy size={18} strokeWidth={2.5} />
                    </button>
                    <button className="px-8 bg-[#74572a] text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-[#5e4622] transition-all">
                      Guardar Cambios
                    </button>
                  </div>
                </div>

                <div className="p-10 flex-1 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/40">Título de la Plantilla</label>
                      <input 
                        type="text" 
                        value={templates.find(t => t.id === isEditing)?.title}
                        className="w-full bg-[#fdf9f6] border border-[#d0c5b6]/20 p-4 rounded-xl text-sm italic font-serif focus:outline-none focus:ring-1 focus:ring-[#74572a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/40">Categoría</label>
                      <select className="w-full bg-[#fdf9f6] border border-[#d0c5b6]/20 p-4 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a] appearance-none uppercase tracking-widest font-bold text-[10px]">
                        {categories.filter(c => c.id !== 'all').map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/40">Contenido Dinámico</label>
                      <button className="flex items-center gap-1.5 text-[8px] text-[#74572a] font-bold uppercase hover:underline">
                        <Sparkles size={10} /> Insertar Variable IA
                      </button>
                    </div>
                    <textarea 
                      className="w-full h-[350px] bg-[#fdf9f6] border border-[#d0c5b6]/20 p-8 rounded-2xl text-sm leading-relaxed font-serif text-[#1c1b1a] focus:outline-none focus:ring-1 focus:ring-[#74572a] resize-none whitespace-pre-wrap shadow-inner"
                      defaultValue={templates.find(t => t.id === isEditing)?.content}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-20 bg-[#f7f3f0]/50 rounded-[3rem] border-2 border-dashed border-[#d0c5b6]/40">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-[#d0c5b6] mb-8 shadow-sm">
                  <Library size={48} strokeWidth={1} />
                </div>
                <h3 className="font-serif italic text-2xl text-[#2d1b0d] mb-4">Gestor de Biblioteca Legal</h3>
                <p className="text-sm text-[#4d463a]/60 leading-relaxed font-medium max-w-sm">
                  Seleccione una plantilla del listado izquierdo para editarla, o cree una nueva basada en sus flujos de trabajo habituales.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
