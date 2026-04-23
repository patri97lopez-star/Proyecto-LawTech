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
  Upload, 
  Tag, 
  Trash2, 
  Download, 
  Eye,
  Filter,
  MoreVertical,
  ChevronDown,
  FolderOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  Folder,
  ChevronRight,
  Maximize2,
  Sparkles,
  SearchCode,
  Fingerprint
} from 'lucide-react';
import { LegalDocument } from '../types';

interface DocumentsSectionProps {
  documents: LegalDocument[];
  onUpload: (doc: any) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

export default function DocumentsSection({ documents, onUpload, onDelete, onUpdateStatus }: DocumentsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'folders'>('folders');

  const folders = Array.from(new Set(documents.map(d => d.folder || 'General')));

  // Simplified upload handler for demo
  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDoc: any = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.name.split('.').pop() || 'file',
        category: 'contrato',
        folder: activeFolder || 'General',
        url: URL.createObjectURL(file), // Local URL for preview
        tags: ['nuevo'],
        status: 'borrador',
        createdAt: Date.now(),
      };
      onUpload(newDoc);
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          doc.extractedText?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesFolder = viewMode === 'grid' || !activeFolder || doc.folder === activeFolder;
    return matchesSearch && matchesCategory && matchesFolder;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'aprobado': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'revisión': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'oficial': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'firmado': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4d463a]/30" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, etiquetas o contenido (OCR)..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#d0c5b6]/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#74572a]/20 transition-all shadow-sm italic font-serif"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex bg-white p-1 rounded-2xl border border-[#d0c5b6]/30 shadow-sm shrink-0">
            <button onClick={() => setViewMode('folders')} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'folders' ? 'bg-[#2d1b0d] text-white' : 'text-[#4d463a]/40'}`}>Carpetas</button>
            <button onClick={() => setViewMode('grid')} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-[#2d1b0d] text-white' : 'text-[#4d463a]/40'}`}>Todos</button>
          </div>

          <label className="flex items-center gap-2 px-6 py-3 bg-[#2d1b0d] text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-[#4a2c16] transition-all cursor-pointer whitespace-nowrap shrink-0">
            <Upload size={16} />
            Subir Documento
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      </div>

      <div className="flex gap-8">
        {viewMode === 'folders' && (
          <aside className="w-64 space-y-2 shrink-0">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#74572a] mb-4 flex items-center gap-2 px-4 italic">
              <Folder size={14} /> Directorios
            </h4>
            <button 
              onClick={() => setActiveFolder(null)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all text-left border ${!activeFolder ? 'bg-[#2d1b0d] text-white border-transparent shadow-lg' : 'bg-white border-[#d0c5b6]/20 text-[#4d463a]/60 hover:border-[#74572a]/40'}`}
            >
              <div className="flex items-center gap-3">
                <FolderOpen size={18} className={!activeFolder ? 'text-blue-400' : 'text-[#d0c5b6]'} />
                <span className="text-xs font-bold">Raíz</span>
              </div>
              <ChevronRight size={14} />
            </button>
            {folders.map(folder => (
              <button 
                key={folder}
                onClick={() => setActiveFolder(folder)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all text-left border ${activeFolder === folder ? 'bg-[#2d1b0d] text-white border-transparent shadow-lg' : 'bg-white border-[#d0c5b6]/20 text-[#4d463a]/60 hover:border-[#74572a]/40'}`}
              >
                <div className="flex items-center gap-3">
                  <Folder size={18} className={activeFolder === folder ? 'text-amber-400' : 'text-[#d0c5b6]'} />
                  <span className="text-xs font-bold truncate">{folder}</span>
                </div>
                <span className="text-[10px] font-mono opacity-40">{documents.filter(d => d.folder === folder).length}</span>
              </button>
            ))}
          </aside>
        )}

        {/* Documents Grid */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-4 border-b border-[#d0c5b6]/20 pb-4">
             {['all', 'contrato', 'escrito', 'notificación'].map(cat => (
               <button 
                 key={cat}
                 onClick={() => setCategoryFilter(cat)}
                 className={`text-[10px] uppercase font-bold tracking-[0.2em] transition-all px-4 py-1 rounded-full
                   ${categoryFilter === cat ? 'bg-[#74572a] text-white shadow-md' : 'text-[#4d463a]/40 hover:bg-[#f7f3f0]'}`}
               >
                 {cat === 'all' ? 'Ver Todos' : cat}
               </button>
             ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredDocs.map((doc) => (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-3xl border border-[#d0c5b6]/20 p-6 shadow-sm hover:shadow-xl hover:border-[#74572a]/20 transition-all group flex flex-col h-64 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                      doc.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                    }`}>
                      {doc.type === 'pdf' ? <FileText size={24} /> : <FileText size={24} strokeWidth={1} />}
                    </div>
                    <div className="flex gap-2">
                       <span className={`px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-widest border ${getStatusStyle(doc.status)}`}>
                        {doc.status}
                      </span>
                      {doc.extractedText && (
                        <div className="p-1 bg-amber-50 text-amber-600 rounded-lg group/ocr relative">
                           <Sparkles size={10} />
                           <div className="absolute right-0 bottom-full mb-2 w-48 p-3 bg-[#2d1b0d] text-white text-[9px] rounded-xl opacity-0 group-hover/ocr:opacity-100 transition-opacity z-10 pointer-events-none shadow-2xl border border-white/10">
                              <p className="font-bold mb-1 flex items-center gap-1 uppercase tracking-tighter"><SearchCode size={10}/> Indexado por OCR</p>
                              <p className="font-light italic opacity-70">El contenido del PDF ha sido digitalizado y es searchable.</p>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#2d1b0d] line-clamp-1 mb-1 group-hover:text-[#74572a] transition-colors font-serif italic">{doc.name}</h4>
                    <p className="text-[9px] text-[#4d463a]/40 font-bold uppercase mb-3 px-2 py-0.5 bg-[#f7f3f0] w-fit rounded">{doc.category}</p>
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-[9px] text-[#4d463a]/60 bg-[#ebe7e4]/20 px-2 py-0.5 rounded-full border border-[#d0c5b6]/10">
                          <Tag size={8} /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-auto border-t border-[#f7f3f0] flex items-center justify-between">
                    <p className="text-[9px] text-[#4d463a]/40 font-medium uppercase font-mono">{new Date(doc.createdAt).toLocaleDateString()}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onUpdateStatus(doc.id, 'firmado')}
                        className="p-2 bg-[#f7f3f0] text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                        title="Firmar electrónicamente"
                      >
                        <Fingerprint size={14} />
                      </button>
                      <button className="p-2 bg-[#f7f3f0] text-[#74572a] rounded-lg hover:bg-[#74572a] hover:text-white transition-all shadow-sm">
                        <Eye size={14} />
                      </button>
                      <button className="p-2 bg-[#f7f3f0] text-[#74572a] rounded-lg hover:bg-[#74572a] hover:text-white transition-all shadow-sm">
                        <Download size={14} />
                      </button>
                      <button 
                        onClick={() => onDelete(doc.id)}
                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredDocs.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-[#d0c5b6]/20">
                  <FolderOpen className="mx-auto text-[#d0c5b6] mb-4" size={48} strokeWidth={1} />
                  <h3 className="font-serif italic text-xl text-[#2d1b0d] mb-2">Directorios sin registros</h3>
                  <p className="text-xs text-[#4d463a]/60 font-medium tracking-wide">La búsqueda con indexación OCR no ha devuelto resultados.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
