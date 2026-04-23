/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Search, 
  Filter, 
  User, 
  Calendar,
  MoreVertical,
  CheckCircle,
  Briefcase,
  ChevronRight,
  Zap,
  PlayCircle,
  ToggleLeft as Toggle,
  Mail,
  FileText
} from 'lucide-react';
import { LegalTask, AutomationRule } from '../types';

interface TasksSectionProps {
  tasks: LegalTask[];
  automationRules: AutomationRule[];
  onAddTask: (task: any) => void;
  onUpdateStatus: (id: string, status: LegalTask['status']) => void;
}

export default function TasksSection({ tasks, automationRules, onAddTask, onUpdateStatus }: TasksSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<LegalTask['status'] | 'all' | 'automation'>('all');

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || t.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getPriorityColor = (priority: LegalTask['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-600 border-red-100';
      case 'medium': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'low': return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Pendientes', value: tasks.filter(t => t.status === 'todo').length, icon: Clock, color: 'blue' },
          { label: 'En Progreso', value: tasks.filter(t => t.status === 'in_progress').length, icon: AlertCircle, color: 'amber' },
          { label: 'Finalizadas', value: tasks.filter(t => t.status === 'done').length, icon: CheckCircle2, color: 'emerald' },
          { label: 'Urgentes', value: tasks.filter(t => t.priority === 'high' && t.status !== 'done').length, icon: AlertCircle, color: 'red' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-[#d0c5b6]/20 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-[#1c1b1a]">{stat.value}</p>
            <p className="text-[10px] uppercase tracking-widest text-[#4d463a]/60 font-bold">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="flex bg-white p-1 rounded-2xl border border-[#d0c5b6]/30 shadow-sm w-fit overflow-x-auto">
          {(['all', 'todo', 'in_progress', 'done', 'automation'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap
                ${activeTab === status ? 'bg-[#2d1b0d] text-white shadow-md' : 'text-[#4d463a]/60 hover:bg-[#f7f3f0]'}`}
            >
              {status === 'all' ? 'Ver Todo' : 
               status === 'todo' ? 'Pendientes' : 
               status === 'in_progress' ? 'En Marcha' : 
               status === 'done' ? 'Hechas' : 'Automatización'}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4d463a]/30" size={18} />
          <input 
            type="text" 
            placeholder="Buscar tareas..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#d0c5b6]/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#74572a]/20 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="flex items-center gap-2 px-8 py-3 bg-[#2d1b0d] text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-[#4a2c16] transition-all whitespace-nowrap">
          <Plus size={16} />
          Nueva Tarea
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'automation' ? (
          <motion.div
            key="automation"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {automationRules.map((rule) => (
              <div key={rule.id} className="bg-white p-8 rounded-[2.5rem] border border-[#d0c5b6]/20 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-2 h-full ${rule.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#74572a]/5 flex items-center justify-center text-[#74572a]">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif italic text-[#2d1b0d]">{rule.name}</h4>
                    <p className="text-xs text-[#4d463a]/60 font-medium">Regla Inteligente</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="p-4 bg-[#f7f3f0] rounded-2xl border border-[#d0c5b6]/10">
                    <p className="text-[10px] uppercase tracking-widest font-black text-[#74572a]/40 mb-2">Activador (Si ocurre que...)</p>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        {rule.trigger === 'email_received' ? <Mail size={16} /> : <Clock size={16} />}
                      </div>
                      <span className="text-xs font-bold text-[#1c1b1a]">
                        {rule.trigger === 'email_received' ? 'Llega un nuevo email' : 'Pasa el tiempo límite'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ChevronRight size={16} className="text-[#d0c5b6] rotate-90 lg:rotate-0" />
                  </div>

                  <div className="p-4 bg-[#2d1b0d] rounded-2xl border border-white/5 text-white">
                    <p className="text-[10px] uppercase tracking-widest font-black text-white/40 mb-2">Acción (Entonces hacer...)</p>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        {rule.action === 'create_task' ? <CheckCircle2 size={16} /> : <Mail size={16} />}
                      </div>
                      <span className="text-xs font-bold">
                        {rule.action === 'create_task' ? 'Crear Tarea Automáticamente' : 'Enviar Notificación'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Toggle size={20} className={rule.isActive ? 'text-emerald-500' : 'text-gray-400'} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#4d463a]/60">
                      {rule.isActive ? 'Activo' : 'Pausado'}
                    </span>
                  </div>
                  <button className="p-3 bg-[#f7f3f0] text-[#74572a] rounded-xl hover:bg-[#2d1b0d] hover:text-white transition-all">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))}
            <button className="border-2 border-dashed border-[#d0c5b6]/40 rounded-[2.5rem] flex flex-col items-center justify-center p-12 hover:bg-[#f7f3f0]/50 transition-all group min-h-[300px]">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#d0c5b6] group-hover:scale-110 transition-transform shadow-sm">
                <Plus size={32} strokeWidth={1} />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#74572a]">Nueva Regla de Automatización</p>
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white p-6 rounded-[2rem] border border-[#d0c5b6]/20 shadow-sm hover:shadow-xl hover:border-[#74572a]/20 transition-all group flex items-center gap-6"
                  >
                    <button 
                      onClick={() => onUpdateStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0
                        ${task.status === 'done' 
                          ? 'bg-emerald-600 text-white shadow-lg' 
                          : 'bg-[#f7f3f0] text-[#d0c5b6] border-2 border-dashed border-[#d0c5b6] hover:border-[#74572a]/40 hover:text-[#74572a]'}`}
                    >
                      {task.status === 'done' ? <CheckCircle size={20} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className={`text-sm font-bold truncate ${task.status === 'done' ? 'text-[#4d463a]/40 line-through' : 'text-[#2d1b0d]'}`}>
                          {task.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] text-[#4d463a]/60 font-medium">
                          <User size={12} className="text-[#8c857d]" /> {task.assigneeName}
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center gap-1.5 text-[10px] text-[#4d463a]/60 font-medium">
                            <Calendar size={12} className="text-[#8c857d]" /> Vence el {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                        {task.caseId && (
                          <div className="flex items-center gap-1.5 text-[10px] text-[#74572a] font-bold uppercase tracking-tighter">
                            <Briefcase size={10} /> Exp: {task.caseId.slice(0, 8)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex -space-x-2">
                        {[1, 2].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#ebe7e4] flex items-center justify-center text-[10px] font-bold text-[#74572a]">
                            U{i}
                          </div>
                        ))}
                      </div>
                      <button className="p-2 text-[#d0c5b6] hover:text-[#74572a] transition-colors">
                        <MoreVertical size={20} />
                      </button>
                      <ChevronRight size={20} className="text-[#d0c5b6] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-[#d0c5b6]/20">
                  <CheckCircle2 className="mx-auto text-[#d0c5b6] mb-4" size={48} strokeWidth={1} />
                  <p className="text-sm text-[#4d463a]/60 font-medium">No hay tareas que coincidan con los filtros.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
