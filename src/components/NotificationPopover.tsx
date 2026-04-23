/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Bell, Archive, CheckCircle2, AlertCircle, Clock, Trash2 } from 'lucide-react';
import { AppNotification } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface NotificationPopoverProps {
  notifications: AppNotification[];
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationPopover({ notifications, onArchive, onDelete }: NotificationPopoverProps) {
  const activeNotifications = notifications
    .filter(n => !n.isArchived)
    .sort((a, b) => {
      const priorityMap = { high: 0, medium: 1, low: 2 };
      if (priorityMap[a.priority] !== priorityMap[b.priority]) {
        return priorityMap[a.priority] - priorityMap[b.priority];
      }
      return b.createdAt - a.createdAt;
    });

  return (
    <div className="absolute top-full right-0 mt-4 w-96 bg-white rounded-3xl shadow-2xl border border-[#d0c5b6]/20 overflow-hidden z-[1100]">
      <div className="p-6 bg-gradient-to-br from-[#f7f3f0] to-white border-b border-[#d0c5b6]/10 flex justify-between items-center">
        <div>
          <h3 className="font-serif italic text-lg text-[#2d1b0d]">Centro de Avisos</h3>
          <p className="text-[10px] uppercase tracking-widest text-[#4d463a]/60 font-medium">Prioridad Legal Inteligente</p>
        </div>
        <Bell className="text-[#74572a]/40" size={20} />
      </div>

      <div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
        <AnimatePresence initial={false}>
          {activeNotifications.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="mx-auto text-[#74572a]/20 mb-3" size={32} />
              <p className="text-sm font-medium text-[#4d463a]/40 italic">Todo al día, abogado.</p>
            </div>
          ) : (
            activeNotifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-4 rounded-2xl border transition-all group relative ${
                  notif.priority === 'high' 
                    ? 'bg-red-50/50 border-red-100 hover:bg-red-50' 
                    : 'bg-white border-transparent hover:bg-[#f7f3f0] hover:border-[#d0c5b6]/20'
                }`}
              >
                <div className="flex gap-3">
                  <div className={`mt-1 shrink-0 ${
                    notif.priority === 'high' ? 'text-red-500' : 
                    notif.priority === 'medium' ? 'text-amber-500' : 'text-blue-500'
                  }`}>
                    {notif.priority === 'high' ? <AlertCircle size={16} /> : <Clock size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1c1b1a] truncate">{notif.title}</p>
                    <p className="text-xs text-[#4d463a]/70 line-clamp-2 mt-0.5 leading-relaxed">{notif.message}</p>
                    <p className="text-[9px] uppercase tracking-wider text-[#4d463a]/40 mt-2 font-bold flex items-center gap-1">
                      <Clock size={10} />
                      {format(notif.createdAt, "d 'de' MMMM, HH:mm", { locale: es })}
                    </p>
                  </div>
                </div>

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onArchive(notif.id)}
                    className="p-2 rounded-full bg-white shadow-sm text-[#4d463a]/60 hover:text-[#74572a] hover:bg-[#ebe7e4]"
                    title="Archivar"
                  >
                    <Archive size={14} />
                  </button>
                  <button 
                    onClick={() => onDelete(notif.id)}
                    className="p-2 rounded-full bg-white shadow-sm text-[#4d463a]/60 hover:text-red-600 hover:bg-red-50"
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-[#f7f3f0]/50 text-center border-t border-[#d0c5b6]/10">
        <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#74572a]/60 hover:text-[#74572a] transition-colors">
          Ver historial completo
        </button>
      </div>
    </div>
  );
}
