/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, Dispatch, SetStateAction, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Send, 
  Sparkles, 
  Loader2, 
  Trash2, 
  Mail, 
  ChevronDown, 
  ChevronUp,
  FileText,
  CheckCircle,
  Copy,
  Info,
  User,
  FolderOpen,
  Link as LinkIcon
} from 'lucide-react';
import { EmailRecord, EmailType, Client, LegalCase } from '../types';
import { processEmail } from '../lib/gemini';

interface EmailsSectionProps {
  emails: EmailRecord[];
  setEmails: Dispatch<SetStateAction<EmailRecord[]>>;
  clients: Client[];
  cases: LegalCase[];
}

export default function EmailsSection({ emails, setEmails, clients, cases }: EmailsSectionProps) {
  const [subject, setSubject] = useState('');
  const [type, setType] = useState<EmailType>('consulta de cliente');
  const [body, setBody] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!subject || !body) return;

    setIsProcessing(true);
    try {
      const result = await processEmail(subject, body, type);
      
      // Smart Linking Logic
      let matchedClientId: string | undefined;
      let matchedCaseId: string | undefined;

      if (result.senderEmail) {
        const foundClient = clients.find(c => c.email.toLowerCase() === result.senderEmail.toLowerCase());
        if (foundClient) {
          matchedClientId = foundClient.id;
          // Try to find a case for this client
          const foundCase = cases.find(c => c.clientId === foundClient.id);
          if (foundCase) matchedCaseId = foundCase.id;
        }
      }

      const newEmail: EmailRecord = {
        id: crypto.randomUUID(),
        subject,
        type,
        body,
        summary: result.summary,
        classification: result.classification,
        suggestedDraft: result.suggestedDraft,
        senderEmail: result.senderEmail,
        senderName: result.senderName,
        clientId: matchedClientId,
        caseId: matchedCaseId,
        status: 'pendiente',
        createdAt: Date.now(),
      };
      setEmails([newEmail, ...emails]);
      setSubject('');
      setBody('');
      setExpandedId(newEmail.id);
    } catch (error) {
      console.error("AI Error:", error);
      alert("Error al procesar el correo con IA. Por favor, revise su conexión.");
    } finally {
      setIsProcessing(false);
    }
  };

  const updateStatus = (id: string, status: EmailRecord['status']) => {
    setEmails(emails.map(e => e.id === id ? { ...e, status } : e));
  };

  const getClientName = (id?: string) => clients.find(c => c.id === id)?.name || 'Cliente no vinculado';
  const getCaseTitle = (id?: string) => cases.find(c => c.id === id)?.title || 'Expediente no vinculado';

  const deleteEmail = (id: string) => {
    setEmails(emails.filter(e => e.id !== id));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copiado al portapapeles");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Form Section */}
      <section className="space-y-8">
        <div className="bg-white p-8 rounded-2xl border border-[#d0c5b6]/30 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Mail size={20} />
            </div>
            <h3 className="text-xl font-serif text-[#2d1b0d]">Nuevo Correo a Procesar</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/60 flex items-center gap-2">
                Asunto del Correo
                <Info size={12} className="text-[#74572a]/40" />
              </label>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ej: Notificación de embargo - Exp. 45/2024"
                className="w-full p-4 bg-[#fdf9f6] border border-[#d0c5b6]/20 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]/20"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/60">Tipo de Correo</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as EmailType)}
                className="w-full p-4 bg-[#fdf9f6] border border-[#d0c5b6]/20 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]/20 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2374572a%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat"
              >
                <option value="notificación judicial">Notificación Judicial</option>
                <option value="aviso de licitación">Aviso de Licitación</option>
                <option value="consulta de cliente">Consulta de Cliente</option>
                <option value="recordatorio de plazo">Recordatorio de Plazo</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/60 flex items-center justify-between">
                Cuerpo del Mensaje
                <span className="text-[8px] font-normal lowercase italic text-[#74572a]/40">Pegue aquí el texto recibido</span>
              </label>
              <textarea 
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Introduzca el contenido del correo..."
                className="w-full min-h-[200px] p-6 bg-[#fdf9f6] border border-[#d0c5b6]/20 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#74572a]/20 resize-none leading-relaxed"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-br from-[#2d1b0d] to-[#4a2c16] text-white rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Procesando con IA...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generar Análisis Inteligente
                </>
              )}
            </button>
          </form>
        </div>

        <div className="p-6 bg-[#f7f3f0] rounded-2xl border border-dashed border-[#d0c5b6] flex gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#74572a] shrink-0 shadow-sm font-serif italic text-lg">i</div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#74572a] mb-1">Instrucciones</p>
            <p className="text-xs text-[#4d463a]/70 leading-relaxed">
              Introduzca el correo para que nuestra IA jurídica genere un resumen estructurado, clasifique el caso y proponga un borrador formal de respuesta listo para enviar.
            </p>
          </div>
        </div>
      </section>

      {/* History/Results Section */}
      <section className="space-y-6">
        <h3 className="text-xl font-serif text-[#2d1b0d] flex items-center gap-2">
          Historial de Correos
          <span className="text-xs font-sans font-normal text-[#4d463a]/40 bg-[#ebe7e4] px-2 py-0.5 rounded-full">{emails.length}</span>
        </h3>
        
        <div className="space-y-4">
          {emails.length > 0 ? (
            emails.map((email) => (
              <motion.div 
                key={email.id}
                layout
                className={`bg-white rounded-2xl border border-[#d0c5b6]/30 overflow-hidden shadow-sm transition-shadow hover:shadow-md ${expandedId === email.id ? 'ring-2 ring-[#74572a]/10' : ''}`}
              >
                <div 
                  className="p-6 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(expandedId === email.id ? null : email.id)}
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className={`p-2 rounded-lg shrink-0 ${email.type === 'notificación judicial' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                      <Mail size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-bold truncate">{email.subject}</h4>
                      <p className="text-[10px] uppercase tracking-wider text-[#4d463a]/60 font-semibold">{email.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteEmail(email.id); }}
                      className="p-2 text-[#d0c5b6] hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    {expandedId === email.id ? <ChevronUp size={18} className="text-[#4d463a]/40" /> : <ChevronDown size={18} className="text-[#4d463a]/40" />}
                  </div>
                </div>

                {expandedId === email.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-6 pb-8 border-t border-[#f7f3f0] pt-6 space-y-6"
                  >
                    {/* Automación y Vínculos */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                          email.status === 'aprobado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          email.status === 'rechazado' ? 'bg-red-50 text-red-600 border-red-100' :
                          'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          Estado: {email.status}
                        </span>
                      </div>
                      {email.status === 'pendiente' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => updateStatus(email.id, 'aprobado')}
                            className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md"
                          >
                            Aprobar
                          </button>
                          <button 
                            onClick={() => updateStatus(email.id, 'revisión')}
                            className="px-3 py-1 bg-amber-500 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-all shadow-md"
                          >
                            Revisar
                          </button>
                          <button 
                            onClick={() => updateStatus(email.id, 'rechazado')}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all shadow-md"
                          >
                            Rechazar
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                      <div className="flex items-center gap-3 p-3 bg-[#fdf9f6] border border-[#d0c5b6]/20 rounded-xl overflow-hidden">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                          <User size={16} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[8px] uppercase tracking-widest font-bold text-[#4d463a]/40">Cliente Vinculado</p>
                          <p className="text-xs font-bold truncate text-[#1c1b1a]">{getClientName(email.clientId)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-[#fdf9f6] border border-[#d0c5b6]/20 rounded-xl overflow-hidden">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                          <FolderOpen size={16} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[8px] uppercase tracking-widest font-bold text-[#4d463a]/40">Expediente Relacionado</p>
                          <p className="text-xs font-bold truncate text-[#1c1b1a]">{getCaseTitle(email.caseId)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-[#fdf9f6] border border-[#d0c5b6]/20 rounded-xl overflow-hidden">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                          <LinkIcon size={16} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[8px] uppercase tracking-widest font-bold text-[#4d463a]/40">Automatización</p>
                          <p className="text-xs font-bold truncate text-[#1c1b1a]">{email.clientId ? 'Vínculo Inteligente Activo' : 'Vínculo Manual Requerido'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Summary */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-[#74572a] bg-[#f0e0cb] w-fit px-2 py-0.5 rounded">
                          <FileText size={12} /> Resumen Estructurado
                        </div>
                        <div className="text-sm text-[#4d463a] leading-relaxed bg-[#fdf9f6] p-4 rounded-xl border border-[#d0c5b6]/20 whitespace-pre-wrap">
                          {email.summary}
                        </div>
                      </div>

                      {/* Classification */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded">
                          <CheckCircle size={12} /> Clasificación
                        </div>
                        <div className="text-sm font-semibold text-[#1c1b1a] bg-[#fdf9f6] p-4 rounded-xl border border-[#d0c5b6]/20 uppercase tracking-widest text-center">
                          {email.classification}
                        </div>
                      </div>
                    </div>

                    {/* Draft Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded">
                          <Sparkles size={12} /> Borrador Sugerido (Formal)
                        </div>
                        <button 
                          onClick={() => copyToClipboard(email.suggestedDraft || '')}
                          className="flex items-center gap-1.5 text-[10px] font-bold text-[#74572a] hover:underline"
                        >
                          <Copy size={12} /> Copiar Borrador
                        </button>
                      </div>
                      <div className="text-sm italic font-serif text-[#1c1b1a] bg-[#fdf9f6] p-6 rounded-xl border border-[#d0c5b6]/20 leading-relaxed whitespace-pre-wrap shadow-inner">
                        "{email.suggestedDraft}"
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-[#f7f3f0] rounded-full flex items-center justify-center mx-auto text-[#d0c5b6]">
                <Mail size={32} />
              </div>
              <p className="text-[#4d463a]/40 text-sm">No hay correos procesados todavía.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
