/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Mail, 
  FileText, 
  Gavel, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Scale,
  Sparkles,
  Zap,
  Activity,
  History,
  TrendingUp,
  Receipt,
  Bell,
  Trash2,
  Users,
  Briefcase,
  DollarSign
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  EmailRecord, 
  JudicialMinute, 
  TenderRecord, 
  AppNotification, 
  InvoiceRecord, 
  LegalCase, 
  Client,
  LegalTask
} from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface DashboardProps {
  emails: EmailRecord[];
  minutes: JudicialMinute[];
  tenders: TenderRecord[];
  notifications: AppNotification[];
  invoices: InvoiceRecord[];
  cases: LegalCase[];
  clients: Client[];
  tasks: LegalTask[];
  onArchiveNotification: (id: string) => void;
  onSwitchTab: (tab: string) => void;
}

export default function Dashboard({ 
  emails, 
  minutes, 
  tenders, 
  notifications, 
  invoices,
  cases,
  clients,
  tasks,
  onArchiveNotification, 
  onSwitchTab 
}: DashboardProps) {
  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').reduce((acc, inv) => acc + inv.totalAmount, 0);
  const pendingInvoices = invoices.filter(inv => inv.status !== 'paid').reduce((acc, inv) => acc + inv.totalAmount, 0);

  const activeNotifications = notifications
    .filter(n => !n.isArchived)
    .sort((a, b) => {
      const priorityMap = { high: 0, medium: 1, low: 2 };
      return priorityMap[a.priority] - priorityMap[b.priority];
    })
    .slice(0, 4);

  // Data for Chart: Revenue per month (mock logic for demo)
  const revenueData = [
    { name: 'Ene', value: paidInvoices * 0.1 },
    { name: 'Feb', value: paidInvoices * 0.15 },
    { name: 'Mar', value: paidInvoices * 0.25 },
    { name: 'Abr', value: paidInvoices * 0.5 },
  ];

  // Data for Pie: Cases by Status
  const caseStatusData = [
    { name: 'Abiertos', value: cases.filter(c => c.status === 'open').length, color: '#74572a' },
    { name: 'Pendientes', value: cases.filter(c => c.status === 'pending').length, color: '#d0c5b6' },
    { name: 'Cerrados', value: cases.filter(c => c.status === 'closed').length, color: '#2d1b0d' },
  ].filter(d => d.value > 0);

  const taskStatusData = [
    { name: 'Pendiente', value: tasks.filter(t => t.status === 'todo').length },
    { name: 'Progreso', value: tasks.filter(t => t.status === 'in_progress').length },
    { name: 'Completada', value: tasks.filter(t => t.status === 'done').length },
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-12">
      {/* Executive Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#2d1b0d] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <DollarSign size={80} strokeWidth={1} />
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1">Honorarios Cobrados</p>
          <p className="text-3xl font-serif font-bold italic">{paidInvoices.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
            <TrendingUp size={14} /> +12% vs mes anterior
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-[2.5rem] border border-[#d0c5b6]/20 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-[#d0c5b6] opacity-10 group-hover:scale-110 transition-transform">
             <Briefcase size={80} strokeWidth={1} />
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/60 mb-1">Expedientes Activos</p>
          <p className="text-3xl font-serif font-bold text-[#2d1b0d] italic">{cases.length}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-[#74572a]">
             <ChevronRight size={14} /> Gestión en tiempo real
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-[2.5rem] border border-[#d0c5b6]/20 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-blue-100 opacity-30 group-hover:scale-110 transition-transform">
             <Users size={80} strokeWidth={1} />
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/60 mb-1">Cartera Clientes</p>
          <p className="text-3xl font-serif font-bold text-[#2d1b0d] italic">{clients.length}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-blue-500">
             <Users size={14} /> Crecimiento orgánico
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-8 rounded-[2.5rem] border border-[#d0c5b6]/20 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-amber-100 opacity-40 group-hover:scale-110 transition-transform">
             <Clock size={80} strokeWidth={1} />
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#4d463a]/60 mb-1">Plazos Pendientes</p>
          <p className="text-3xl font-serif font-bold text-[#2d1b0d] italic">{tasks.filter(t => t.status !== 'done').length}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-amber-600">
             <AlertCircle size={14} /> Requiere atención inmediata
          </div>
        </motion.div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-[#d0c5b6]/20 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-xl font-serif italic text-[#2d1b0d]">Rendimiento Financiero</h4>
              <p className="text-xs text-[#4d463a]/40 uppercase tracking-widest font-bold mt-1">Ingresos por Servicios Legales</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#74572a]">Total Pendiente: {pendingInvoices.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
            </div>
          </div>
          <div className="flex-1 h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f7f3f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8c857d' }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2d1b0d', borderRadius: '16px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                  cursor={{ fill: '#f7f3f0' }}
                />
                <Bar dataKey="value" fill="#74572a" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-10 rounded-[3rem] border border-[#d0c5b6]/20 shadow-sm">
          <h4 className="text-xl font-serif italic text-[#2d1b0d] mb-8">Estado Expedientes</h4>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={caseStatusData.length > 0 ? caseStatusData : [{ name: 'Sin datos', value: 1, color: '#f7f3f0' }]}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {caseStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-2xl font-bold text-[#2d1b0d]">{cases.length}</p>
              <p className="text-[8px] uppercase tracking-widest font-bold opacity-40">Total</p>
            </div>
          </div>
          <div className="mt-8 space-y-3">
             {caseStatusData.map((item, idx) => (
               <div key={idx} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                   <span className="text-xs font-bold text-[#4d463a]/80">{item.name}</span>
                 </div>
                 <span className="text-xs font-mono text-[#d0c5b6]">{Math.round((item.value / cases.length) * 100)}%</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Timeline & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-[#d0c5b6]/20 shadow-sm">
          <h4 className="text-xl font-serif italic text-[#2d1b0d] mb-8">Flujo de Tareas del Despacho</h4>
          <div className="space-y-6">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-[#f7f3f0] transition-all group">
                <div className={`w-3 h-3 rounded-full shrink-0 ${task.status === 'done' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-[#1c1b1a]">{task.title}</p>
                  <p className="text-[10px] text-[#4d463a]/60 uppercase tracking-widest font-bold">{task.assigneeName} • Vence el {new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
                <ChevronRight size={16} className="text-[#d0c5b6] group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="py-12 text-center text-[#4d463a]/40 italic text-sm">No hay tareas programadas para esta semana.</div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#f7f3f0] to-white p-10 rounded-[3rem] border border-[#d0c5b6]/20 shadow-sm relative overflow-hidden">
           <Zap className="absolute top-0 right-0 m-8 text-[#74572a]/10" size={120} />
           <h4 className="text-xl font-serif italic text-[#2d1b0d] mb-6">Optimización por Inteligencia Artificial</h4>
           <div className="space-y-8 relative z-10">
              <div className="p-6 bg-white/80 rounded-2xl shadow-sm border border-white">
                 <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="text-amber-500" size={20} />
                    <p className="text-sm font-bold uppercase tracking-widest text-[#74572a]">Resumen de Actividad IA</p>
                 </div>
                 <ul className="space-y-3">
                   <li className="text-xs text-[#4d463a]/80 leading-relaxed">• Hemos pre-clasificado <b>{emails.length}</b> correos judiciales.</li>
                   <li className="text-xs text-[#4d463a]/80 leading-relaxed">• Se han generado <b>{invoices.length}</b> borradores de honorarios automatizados.</li>
                   <li className="text-xs text-[#4d463a]/80 leading-relaxed">• {tenders.length} licitaciones analizadas y estructuradas hoy.</li>
                 </ul>
              </div>
              <div className="p-6 bg-[#2d1b0d] rounded-2xl text-white shadow-xl shadow-[#2d1b0d]/20 self-end">
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-2">Consejo del Atelier</p>
                <p className="text-xs leading-relaxed font-light italic">"Su rendimiento financiero ha crecido un 18% este trimestre gracias a la automatización de la facturación recurrente. Considere estandarizar más plantillas legales."</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

