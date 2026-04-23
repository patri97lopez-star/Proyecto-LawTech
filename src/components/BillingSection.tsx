/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, Dispatch, SetStateAction, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  Sparkles, 
  Save, 
  FileDown, 
  ChevronDown, 
  ChevronUp,
  CreditCard,
  Building2,
  Calendar,
  User,
  Euro,
  Loader2,
  Check,
  Clock
} from 'lucide-react';
import { InvoiceRecord, InvoiceItem, Client, LegalCase } from '../types';
import { suggestInvoiceItems } from '../lib/gemini';

interface BillingSectionProps {
  invoices: InvoiceRecord[];
  setInvoices: Dispatch<SetStateAction<InvoiceRecord[]>>;
  clients: Client[];
  cases: LegalCase[];
}

export default function BillingSection({ invoices, setInvoices, clients, cases }: BillingSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Form State
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [clientName, setClientName] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [notes, setNotes] = useState('');

  const calculateTotals = (currentItems: InvoiceItem[]) => {
    const subtotal = currentItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const tax = currentItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice * item.taxRate), 0);
    return { subtotal, tax, total: subtotal + tax };
  };

  const handleAutomateItems = async () => {
    if (!workDescription) return;
    setIsProcessing(true);
    try {
      const result = await suggestInvoiceItems(workDescription);
      const newItems: InvoiceItem[] = result.suggestedItems.map((item: any) => ({
        ...item,
        id: Math.random().toString(36).substr(2, 9)
      }));
      setItems(newItems);
    } catch (error) {
      console.error('Automation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 0.21
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const finalClientName = selectedClientId ? (clients.find(c => c.id === selectedClientId)?.name || '') : clientName;
    if (!finalClientName || items.length === 0) return;

    const { tax, total } = calculateTotals(items);

    const newInvoice: InvoiceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber: `INV-${new Date().getFullYear()}-${invoices.length + 101}`,
      clientId: selectedClientId || undefined,
      clientName: finalClientName,
      caseId: selectedCaseId || undefined,
      issueDate,
      dueDate: dueDate || issueDate,
      items,
      status: 'draft',
      totalAmount: total,
      totalTax: tax,
      notes,
      createdAt: Date.now()
    };

    setInvoices([newInvoice, ...invoices]);
    resetForm();
  };

  const resetForm = () => {
    setIsAdding(false);
    setSelectedClientId('');
    setSelectedCaseId('');
    setClientName('');
    setIssueDate(new Date().toISOString().split('T')[0]);
    setDueDate('');
    setWorkDescription('');
    setItems([]);
    setNotes('');
  };

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  const { subtotal, tax, total } = calculateTotals(items);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header & Toggle */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-[#d0c5b6]/30 shadow-sm">
        <div>
          <h3 className="text-xl font-serif text-[#2d1b0d]">Gestión de Facturación</h3>
          <p className="text-xs text-[#4d463a]/60 uppercase tracking-widest mt-1">Automatización de Honorarios y Servicios</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all
            ${isAdding ? 'bg-[#ebe7e4] text-[#74572a]' : 'bg-[#2d1b0d] text-white shadow-lg shadow-[#2d1b0d]/20 hover:scale-105'}`}
        >
          {isAdding ? <Plus className="rotate-45" size={18} /> : <Plus size={18} />}
          {isAdding ? 'Cancelar' : 'Nueva Factura'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl border border-[#d0c5b6]/30 shadow-xl overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-10 space-y-10">
              {/* Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/50 flex items-center gap-2">
                    <User size={12} /> Cliente Vinculado
                  </label>
                  <div className="relative group">
                    <select 
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full bg-[#fdf9f6]/50 border border-[#d0c5b6]/20 p-4 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]/30 appearance-none cursor-pointer transition-all hover:border-[#74572a]/40"
                      required
                    >
                      <option value="">Seleccionar Cliente...</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                      <option value="new">+ Escribir nombre manual...</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74572a] pointer-events-none transition-transform group-hover:translate-y-[-40%]" />
                  </div>
                </div>

                {selectedClientId === 'new' && (
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/50 flex items-center gap-2">
                      <User size={12} /> Nombre del Cliente Manual
                    </label>
                    <input 
                      type="text" 
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ej. Real Estate Madrid S.L."
                      className="w-full bg-[#fdf9f6] border border-[#d0c5b6]/20 p-4 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/50 flex items-center gap-2">
                    <Building2 size={12} /> Expediente Relacionado
                  </label>
                  <div className="relative group">
                    <select 
                      value={selectedCaseId}
                      onChange={(e) => setSelectedCaseId(e.target.value)}
                      className="w-full bg-[#fdf9f6]/50 border border-[#d0c5b6]/20 p-4 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]/30 appearance-none cursor-pointer transition-all hover:border-[#74572a]/40 disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={!selectedClientId}
                    >
                      <option value="">Opcional: Seleccionar Expediente...</option>
                      {cases.filter(c => c.clientId === selectedClientId).map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74572a] pointer-events-none transition-transform group-hover:translate-y-[-40%] opacity-50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/50 flex items-center gap-2">
                    <Calendar size={12} /> Fecha de Emisión
                  </label>
                  <input 
                    type="date" 
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full bg-[#fdf9f6] border border-[#d0c5b6]/20 p-4 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/50 flex items-center gap-2">
                    <Clock size={12} /> Vencimiento
                  </label>
                  <input 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#fdf9f6] border border-[#d0c5b6]/20 p-4 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]"
                  />
                </div>
              </div>

              {/* AI Automation Section */}
              <div className="p-8 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-amber-600" size={18} />
                  <h4 className="text-sm font-serif text-amber-900">Automatización Inteligente de Conceptos</h4>
                </div>
                <p className="text-xs text-amber-800/70">
                  Describa brevemente el trabajo realizado para que la IA sugiera los conceptos facturables y precios de mercado.
                </p>
                <div className="flex gap-4">
                  <textarea 
                    value={workDescription}
                    onChange={(e) => setWorkDescription(e.target.value)}
                    placeholder="Ej. Redacción de contrato de arrendamiento, 3 reuniones de 1 hora, revisión de documentación registral..."
                    className="flex-1 bg-white border border-amber-200 p-4 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none h-24"
                  />
                  <button 
                    type="button"
                    onClick={handleAutomateItems}
                    disabled={!workDescription || isProcessing}
                    className="px-6 py-4 bg-amber-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:bg-amber-700 disabled:opacity-50 h-fit self-end"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={18} /> : 'Generar Items'}
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-serif text-[#2d1b0d]">Conceptos de Facturación</h4>
                  <button 
                    type="button"
                    onClick={handleAddItem}
                    className="text-[10px] font-bold text-[#74572a] uppercase tracking-widest flex items-center gap-2 hover:underline"
                  >
                    <Plus size={14} /> Añadir Concepto
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-end animate-in fade-in slide-in-from-top-2">
                      <div className="flex-1 space-y-2">
                        <label className="text-[8px] uppercase tracking-wider font-bold text-[#4d463a]/40">Descripción</label>
                        <input 
                          type="text" 
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Concepto del servicio"
                          className="w-full bg-[#fdf9f6] border border-[#d0c5b6]/10 p-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]"
                        />
                      </div>
                      <div className="w-24 space-y-2">
                        <label className="text-[8px] uppercase tracking-wider font-bold text-[#4d463a]/40">Cantidad</label>
                        <input 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                          className="w-full bg-[#fdf9f6] border border-[#d0c5b6]/10 p-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]"
                        />
                      </div>
                      <div className="w-32 space-y-2">
                        <label className="text-[8px] uppercase tracking-wider font-bold text-[#4d463a]/40">Precio Unit. (€)</label>
                        <input 
                          type="number" 
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                          className="w-full bg-[#fdf9f6] border border-[#d0c5b6]/10 p-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]"
                        />
                      </div>
                      <div className="w-24 space-y-2 text-right p-3 bg-[#ebe7e4]/30 rounded-lg">
                        <label className="text-[8px] uppercase tracking-wider font-bold text-[#4d463a]/40 block mb-1">Total</label>
                        <span className="text-sm font-bold text-[#2d1b0d]">{(item.quantity * item.unitPrice).toFixed(2)}€</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-3 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Summary */}
              <div className="flex flex-col items-end gap-2 pt-8 border-t border-[#d0c5b6]/20">
                <div className="flex justify-between w-64 text-sm text-[#4d463a]/60">
                  <span>Subtotal:</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between w-64 text-sm text-[#4d463a]/60">
                  <span>IVA (21%):</span>
                  <span>{tax.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between w-64 text-2xl font-serif text-[#2d1b0d] mt-2 border-t border-[#d0c5b6]/10 pt-4">
                  <span>Total:</span>
                  <span className="font-bold">{total.toFixed(2)}€</span>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-10">
                <button 
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 text-sm font-bold uppercase tracking-widest text-[#4d463a]/40 hover:text-[#2d1b0d] transition-colors"
                >
                  Descartar
                </button>
                <button 
                  type="submit"
                  disabled={!clientName || items.length === 0}
                  className="flex items-center gap-2 bg-[#74572a] text-white px-10 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest shadow-xl hover:bg-[#5e4622] transition-all disabled:opacity-50 active:scale-95"
                >
                  <Save size={18} /> Guardar Factura
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoices List */}
      <div className="space-y-6">
        <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[#4d463a]/60 px-4">Historial de Facturación</h4>
        <div className="space-y-4">
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <motion.div
                key={invoice.id}
                layout
                className="bg-white rounded-3xl border border-[#d0c5b6]/30 shadow-sm overflow-hidden hover:shadow-md transition-all"
              >
                <div 
                  className="p-6 cursor-pointer flex items-center justify-between"
                  onClick={() => setExpandedId(expandedId === invoice.id ? null : invoice.id)}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#fdf9f6] flex items-center justify-center text-[#74572a] border border-[#d0c5b6]/20 shadow-inner">
                      <Receipt size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h5 className="font-bold text-[#1c1b1a]">{invoice.clientName}</h5>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-tighter border
                          ${invoice.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                            invoice.status === 'sent' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            invoice.status === 'overdue' ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'}`}
                        >
                          {invoice.status === 'draft' ? 'borrador' : 
                           invoice.status === 'sent' ? 'enviada' : 
                           invoice.status === 'paid' ? 'pagada' : 
                           'vencida'}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#4d463a]/60 font-medium uppercase tracking-widest mt-1">
                        {invoice.invoiceNumber} • {new Date(invoice.issueDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#2d1b0d]">{invoice.totalAmount.toFixed(2)}€</p>
                      <p className="text-[9px] uppercase tracking-widest text-[#4d463a]/40 font-bold">Total Iva Incl.</p>
                    </div>
                    {expandedId === invoice.id ? <ChevronUp size={20} className="text-[#d0c5b6]" /> : <ChevronDown size={20} className="text-[#d0c5b6]" />}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === invoice.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[#d0c5b6]/10 bg-[#fdf9f6]/30"
                    >
                      <div className="p-10 space-y-8">
                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                          <div className="p-5 bg-white rounded-2xl border border-[#d0c5b6]/20">
                            <User size={16} className="text-[#74572a] mb-3" />
                            <p className="text-[8px] uppercase tracking-widest text-[#4d463a]/50 font-bold">Datos del Cliente</p>
                            <p className="text-sm font-semibold mt-1">{invoice.clientName}</p>
                            <p className="text-[10px] text-[#4d463a]/60 mt-1">
                              {clients.find(c => c.id === invoice.clientId)?.email || 'Sin datos de contacto'}
                            </p>
                          </div>
                          <div className="p-5 bg-white rounded-2xl border border-[#d0c5b6]/20">
                            <Building2 size={16} className="text-[#74572a] mb-3" />
                            <p className="text-[8px] uppercase tracking-widest text-[#4d463a]/50 font-bold">Datos del Expediente</p>
                            <p className="text-sm font-semibold mt-1">
                              {invoice.caseId ? cases.find(c => c.id === invoice.caseId)?.title : 'Servicios Generales'}
                            </p>
                            {invoice.caseId && (
                              <p className="text-[10px] text-[#4d463a]/60 mt-1">
                                Ref: {cases.find(c => c.id === invoice.caseId)?.referenceNumber}
                              </p>
                            )}
                          </div>
                          <div className="p-5 bg-white rounded-2xl border border-[#d0c5b6]/20 col-span-2 space-y-3">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-[#4d463a]/60 uppercase tracking-widest font-bold">Base Imponible:</span>
                              <span className="font-semibold">{(invoice.totalAmount - invoice.totalTax).toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-[#4d463a]/60 uppercase tracking-widest font-bold">IVA (21%):</span>
                              <span className="font-semibold">{invoice.totalTax.toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-[#d0c5b6]/10">
                              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#2d1b0d]">Importe Total:</span>
                              <span className="text-xl font-bold text-[#74572a]">{invoice.totalAmount.toFixed(2)}€</span>
                            </div>
                          </div>
                        </div>

                        {/* Items Breakdown */}
                        <div className="bg-white rounded-2xl border border-[#d0c5b6]/10 divide-y divide-[#d0c5b6]/10 overflow-hidden">
                          <div className="p-4 bg-[#f7f3f0] grid grid-cols-12 gap-4">
                            <div className="col-span-7 text-[9px] uppercase tracking-widest font-bold text-[#4d463a]/40">Descripción Concepto</div>
                            <div className="col-span-2 text-[9px] uppercase tracking-widest font-bold text-[#4d463a]/40 text-center">Cant.</div>
                            <div className="col-span-3 text-[9px] uppercase tracking-widest font-bold text-[#4d463a]/40 text-right">Monto</div>
                          </div>
                          {invoice.items.map((item) => (
                            <div key={item.id} className="p-5 grid grid-cols-12 gap-4 items-center">
                              <div className="col-span-7 font-medium text-sm text-[#1c1b1a]">{item.description}</div>
                              <div className="col-span-2 text-sm text-[#4d463a]/60 text-center font-mono">{item.quantity}</div>
                              <div className="col-span-3 text-sm font-bold text-[#2d1b0d] text-right">{(item.quantity * item.unitPrice).toFixed(2)}€</div>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center pt-6">
                          <button 
                            onClick={() => deleteInvoice(invoice.id)}
                            className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest"
                          >
                            <Trash2 size={14} /> Eliminar Factura
                          </button>
                          <div className="flex gap-4">
                            <button className="flex items-center gap-2 bg-[#ebe7e4] text-[#74572a] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#e0dad5] transition-colors">
                              <FileDown size={14} /> Exportar PDF
                            </button>
                            <button className="flex items-center gap-2 bg-[#74572a] text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-[#5e4622] transition-colors">
                              Marcar como Pagada
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="py-24 text-center space-y-4 bg-white rounded-3xl border border-[#d0c5b6]/20 border-dashed">
              <Receipt className="mx-auto text-[#d0c5b6]/40" size={48} strokeWidth={1} />
              <div>
                <p className="text-[#1c1b1a] font-serif text-lg">No hay facturas registradas</p>
                <p className="text-sm text-[#4d463a]/60 font-light mt-1">Cree su primera factura profesional de forma automatizada.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
