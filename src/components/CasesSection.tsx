/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderOpen, 
  Search, 
  Plus, 
  Filter, 
  ChevronRight, 
  MoreVertical,
  Clock,
  User,
  Gavel,
  CheckCircle2,
  AlertCircle,
  FileText,
  Mail
} from 'lucide-react';
import { LegalCase, EmailRecord } from '../types';

interface CasesSectionProps {
  cases: LegalCase[];
  setCases: (cases: LegalCase[] | ((prev: LegalCase[]) => LegalCase[])) => void;
  emails: EmailRecord[];
}

export default function CasesSection({ cases, setCases, emails }: CasesSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<LegalCase['status'] | 'all'>('all');

  const getCaseEmails = (caseId: string) => emails.filter(e => e.caseId === caseId);

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: LegalCase['status']) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-700 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'archived': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4d463a]/30" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por expediente, título o cliente..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#d0c5b6]/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#74572a]/20 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-white p-1 rounded-2xl border border-[#d0c5b6]/20 shadow-sm">
            {(['all', 'open', 'pending', 'closed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  filterStatus === status 
                    ? 'bg-[#2d1b0d] text-white shadow-md' 
                    : 'text-[#4d463a]/60 hover:bg-[#f7f3f0]'
                }`}
              >
                {status === 'all' ? 'Todos' : 
                 status === 'open' ? 'Abiertos' :
                 status === 'pending' ? 'Pendientes' : 'Cerrados'}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#74572a] text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-[#5e4622] transition-all whitespace-nowrap">
            <Plus size={16} />
            Nuevo Expediente
          </button>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCases.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-[#d0c5b6]/20"
            >
              <FolderOpen className="mx-auto text-[#d0c5b6] mb-4" size={48} />
              <h3 className="font-serif italic text-xl text-[#2d1b0d] mb-2">No se encontraron expedientes</h3>
              <p className="text-sm text-[#4d463a]/60">Prueba con otros términos de búsqueda o filtros.</p>
            </motion.div>
          ) : (
            filteredCases.map((legalCase) => (
              <motion.div
                key={legalCase.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="group bg-white rounded-[2.5rem] border border-[#d0c5b6]/20 p-8 shadow-sm hover:shadow-xl hover:border-[#74572a]/20 transition-all flex flex-col gap-6"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${getStatusColor(legalCase.status)}`}>
                        {legalCase.status === 'open' ? 'En Trámite' : 
                         legalCase.status === 'pending' ? 'Pendiente' : 
                         legalCase.status === 'closed' ? 'Sentenciado' : 'Archivado'}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#74572a]/60 tracking-wider">
                        REF: {legalCase.referenceNumber}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif italic text-[#2d1b0d] group-hover:text-[#74572a] transition-colors line-clamp-1">
                      {legalCase.title}
                    </h3>
                  </div>
                  <button className="p-2 rounded-xl hover:bg-[#f7f3f0] text-[#4d463a]/40 group-hover:text-[#74572a] transition-all">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#f7f3f0] rounded-2xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#74572a] shadow-sm">
                      <User size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] uppercase tracking-widest text-[#4d463a]/40 font-bold">Cliente</p>
                      <p className="text-xs font-bold truncate">{legalCase.clientName}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-[#f7f3f0] rounded-2xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#74572a] shadow-sm">
                      <Gavel size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] uppercase tracking-widest text-[#4d463a]/40 font-bold">Tipo</p>
                      <p className="text-xs font-bold capitalize">{legalCase.type}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-xs text-[#4d463a]/70 line-clamp-2 leading-relaxed">
                    {legalCase.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#d0c5b6]/10 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[#4d463a]/40">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                      <FileText size={14} />
                      {legalCase.documents?.length || 0} Docs
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-500">
                      <Mail size={14} />
                      {getCaseEmails(legalCase.id).length} Correos IA
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                      <Clock size={14} />
                      {new Date(legalCase.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#74572a] hover:text-[#2d1b0d] transition-colors group/btn">
                    Ver Expediente
                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
