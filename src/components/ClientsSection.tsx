/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  ExternalLink, 
  Filter,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  Briefcase,
  FileText,
  Clock,
  Download,
  AlertCircle,
  Receipt,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Client, EmailRecord, LegalCase, InvoiceRecord, LegalTask } from '../types';

interface ClientsSectionProps {
  clients: Client[];
  setClients: (clients: Client[] | ((prev: Client[]) => Client[])) => void;
  emails: EmailRecord[];
  cases: LegalCase[];
  invoices: InvoiceRecord[];
  tasks: LegalTask[];
}

export default function ClientsSection({ 
  clients, 
  setClients, 
  emails, 
  cases,
  invoices,
  tasks
}: ClientsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.taxId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientEmails = (clientId: string) => emails.filter(e => e.clientId === clientId);
  const getClientCases = (clientId: string) => cases.filter(c => c.clientId === clientId);
  const getClientInvoices = (clientId: string) => invoices.filter(i => i.clientId === clientId);
  const getClientTasks = (clientId: string) => tasks.filter(t => t.clientId === clientId);

  const exportClients = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID", "Nombre", "Email", "Facturación"].join(",") + "\n"
      + clients.map(c => [c.id, c.name, c.email, c.totalBilled].join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "clientes_leyflow.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white rounded-3xl shadow-sm border border-[#d0c5b6]/20"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1c1b1a]">{clients.length}</p>
              <p className="text-[10px] uppercase tracking-widest text-[#4d463a]/60 font-bold">Clientes Totales</p>
            </div>
          </div>
          <div className="h-1 w-full bg-blue-50 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 w-full" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white rounded-3xl shadow-sm border border-[#d0c5b6]/20"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1c1b1a]">
                {clients.reduce((acc, c) => acc + c.totalBilled, 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-[#4d463a]/60 font-bold">Cartera Valorada</p>
            </div>
          </div>
          <div className="h-1 w-full bg-green-50 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 w-full opacity-80" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white rounded-3xl shadow-sm border border-[#d0c5b6]/20"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#74572a]/5 flex items-center justify-center text-[#74572a]">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1c1b1a]">
                {clients.reduce((acc, c) => acc + c.caseCount, 0)}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-[#4d463a]/60 font-bold">Casos Activos</p>
            </div>
          </div>
          <div className="h-1 w-full bg-[#74572a]/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#74572a] w-full opacity-60" />
          </div>
        </motion.div>
      </div>

      <div className="flex gap-12">
        {/* Client List */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4d463a]/30" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por nombre, email o DNI..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-[#d0c5b6]/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#74572a]/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={exportClients}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-[#d0c5b6]/30 text-[#74572a] rounded-2xl text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-[#f7f3f0] transition-all"
            >
              <Download size={16} />
              Exportar
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#2d1b0d] text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all">
              <Plus size={16} />
              Añadir Cliente
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredClients.map((client) => (
              <motion.button
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className={`flex items-center gap-8 p-8 rounded-[2.5rem] border transition-all text-left ${
                  selectedClient?.id === client.id 
                    ? 'bg-[#2d1b0d] text-white border-transparent shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] scale-[1.02]' 
                    : 'bg-white border-[#d0c5b6]/20 hover:border-[#74572a]/40 shadow-sm'
                }`}
              >
                <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center shrink-0 ${
                  selectedClient?.id === client.id ? 'bg-white/10' : 'bg-[#f7f3f0]'
                }`}>
                  <Users size={32} className={selectedClient?.id === client.id ? 'text-white' : 'text-[#74572a]'} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-serif italic text-2xl truncate mb-1">{client.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <p className={`text-[11px] uppercase tracking-[0.2em] font-bold ${
                      selectedClient?.id === client.id ? 'text-white/60' : 'text-[#4d463a]/60'
                    }`}>
                      {client.taxId || 'Sin DNI'}
                    </p>
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-30" />
                    <p className={`text-[11px] uppercase tracking-[0.2em] font-bold ${
                      selectedClient?.id === client.id ? 'text-white/60' : 'text-[#4d463a]/60'
                    }`}>
                      {client.type === 'individual' ? 'Persona Física' : 'Sociedad'}
                    </p>
                  </div>
                </div>

                <div className="text-right hidden lg:block pr-4">
                  <p className="font-bold text-xl mb-1">{client.totalBilled.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                  <p className={`text-[10px] uppercase tracking-widest font-bold ${
                    selectedClient?.id === client.id ? 'text-white/40' : 'text-[#4d463a]/40'
                  }`}>
                    Volumen de Negocio
                  </p>
                </div>

                <ChevronRight size={24} className={selectedClient?.id === client.id ? 'text-white' : 'text-[#d0c5b6]'} />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Client Details Sidebar */}
        <div className="w-[32rem] shrink-0 h-fit sticky top-8">
          <AnimatePresence mode="wait">
            {selectedClient ? (
              <motion.div
                key={selectedClient.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-[3rem] shadow-2xl border border-[#d0c5b6]/20 overflow-hidden"
              >
                <div className="h-40 bg-gradient-to-br from-[#2d1b0d] to-[#4a2c16]" />
                <div className="px-10 pb-12 -mt-16">
                  <div className="w-32 h-32 rounded-[2rem] bg-white p-1.5 shadow-2xl mb-8 ml-1">
                    <div className="w-full h-full rounded-[1.5rem] bg-[#f7f3f0] flex items-center justify-center text-[#74572a]">
                      <Users size={56} />
                    </div>
                  </div>

                  <h3 className="text-3xl font-serif italic text-[#2d1b0d] mb-3">{selectedClient.name}</h3>
                  <p className="text-sm text-[#4d463a]/60 font-medium mb-10 leading-relaxed italic">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] uppercase tracking-widest font-black mr-2">Activo</span>
                    Incorporado el {new Date(selectedClient.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-[#f7f3f0] rounded-2xl group transition-all hover:bg-[#ebe7e4]">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#74572a] shadow-sm">
                        <Mail size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] uppercase tracking-widest text-[#4d463a]/40 font-bold">Email Automatizado</p>
                        <p className="text-xs font-bold truncate">{selectedClient.email}</p>
                      </div>
                      <button className="text-[#74572a] opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-[#d0c5b6]/20">
                      <div className="w-10 h-10 rounded-xl bg-[#f7f3f0] flex items-center justify-center text-[#74572a]">
                        <Phone size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] uppercase tracking-widest text-[#4d463a]/40 font-bold">Teléfono de Contacto</p>
                        <p className="text-xs font-bold">{selectedClient.phone || 'No registrado'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-[#d0c5b6]/20">
                      <div className="w-10 h-10 rounded-xl bg-[#f7f3f0] flex items-center justify-center text-[#74572a]">
                        <MapPin size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] uppercase tracking-widest text-[#4d463a]/40 font-bold">Dirección Fiscal</p>
                        <p className="text-xs font-bold leading-tight">{selectedClient.address || 'No registrada'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-[#d0c5b6]/20">
                      <div className="w-10 h-10 rounded-xl bg-[#f7f3f0] flex items-center justify-center text-[#74572a]">
                        <CreditCard size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] uppercase tracking-widest text-[#4d463a]/40 font-bold">DNI / CIF / Tax ID</p>
                        <p className="text-xs font-bold">{selectedClient.taxId || 'Pendiente'}</p>
                      </div>
                    </div>

                    {/* Linked Cases */}
                    <div className="pt-4 border-t border-[#f7f3f0]">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#74572a] mb-4 flex items-center gap-2">
                        <Briefcase size={12} /> Expedientes Vinculados
                      </h4>
                      <div className="space-y-3">
                        {getClientCases(selectedClient.id).length > 0 ? (
                          getClientCases(selectedClient.id).map(c => (
                            <div key={c.id} className="p-3 bg-[#fdf9f6] rounded-xl border border-[#d0c5b6]/20 flex items-center justify-between group">
                              <p className="text-xs font-bold truncate pr-2">{c.title}</p>
                              <span className="text-[8px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 shrink-0">{c.status}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-[#4d463a]/40 italic">Sin expedientes activos.</p>
                        )}
                      </div>
                    </div>

                    {/* Recent Automated Emails */}
                    <div className="pt-4 border-t border-[#f7f3f0]">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-blue-600 mb-4 flex items-center gap-2">
                        <Mail size={12} /> Correos IA
                      </h4>
                      <div className="space-y-2">
                        {getClientEmails(selectedClient.id).slice(0, 2).map(e => (
                          <div key={e.id} className="p-2 bg-blue-50/30 rounded-lg text-[10px] border border-blue-100/50">
                            <p className="font-bold truncate">{e.subject}</p>
                          </div>
                         ))}
                      </div>
                    </div>

                    {/* Internal Notes */}
                    <div className="pt-4 border-t border-[#f7f3f0]">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#74572a] mb-4 flex items-center gap-2">
                        <FileText size={12} /> Historial de Notas
                      </h4>
                      <div className="space-y-2">
                          <div className="p-3 bg-[#fdf9f6] rounded-xl border border-[#d0c5b6]/20">
                            <p className="text-[10px] font-medium leading-relaxed italic text-[#4d463a]">"Cliente contacta para agilizar la entrega de documentación del expediente mercantil."</p>
                            <p className="text-[8px] uppercase tracking-widest text-[#d0c5b6] mt-2 font-black">20 May, 2024 • Patricia L.</p>
                          </div>
                      </div>
                    </div>

                    {/* Pending Tasks */}
                    <div className="pt-4 border-t border-[#f7f3f0]">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-amber-600 mb-4 flex items-center gap-2">
                        <Calendar size={12} /> Tareas Activas
                      </h4>
                      <div className="space-y-2">
                        {getClientTasks(selectedClient.id).slice(0, 2).map(t => (
                          <div key={t.id} className="p-2 bg-amber-50/30 rounded-lg text-[10px] border border-amber-100/50 flex justify-between">
                            <span className="truncate">{t.title}</span>
                            <span className="font-bold shrink-0">{new Date(t.dueDate).toLocaleDateString()}</span>
                          </div>
                         ))}
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="pt-4 border-t border-[#f7f3f0]">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 mb-4 flex items-center gap-2">
                        <Receipt size={12} /> Facturación Reciente
                      </h4>
                      <div className="space-y-2">
                        {getClientInvoices(selectedClient.id).slice(0, 2).map(inv => (
                          <div key={inv.id} className="p-2 bg-emerald-50/30 rounded-lg text-[10px] border border-emerald-100/50 flex justify-between">
                            <span className="font-medium">#{inv.invoiceNumber}</span>
                            <span className="font-bold">{inv.totalAmount.toLocaleString()} €</span>
                          </div>
                         ))}
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-8 flex items-center justify-center gap-3 bg-[#2d1b0d] text-white py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-[#4a2c16] transition-all active:scale-[0.98]">
                    Gestionar Expedientes
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-[500px] flex flex-col items-center justify-center text-center p-12 bg-[#f7f3f0]/50 rounded-[2.5rem] border border-dashed border-[#d0c5b6]/40">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-[#d0c5b6] mb-4">
                  <Users size={32} />
                </div>
                <h4 className="font-serif italic text-lg text-[#2d1b0d] mb-2">Visor de Clientes</h4>
                <p className="text-xs text-[#4d463a]/60 leading-relaxed font-medium">
                  Seleccione un cliente para ver su ficha técnica completa, facturación y datos de contacto.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
