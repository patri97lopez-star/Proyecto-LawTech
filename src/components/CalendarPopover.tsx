/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  MoreVertical,
  X
} from 'lucide-react';
import { CalendarEvent } from '../types';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { es } from 'date-fns/locale';

interface CalendarPopoverProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => void;
}

export default function CalendarPopover({ events, onAddEvent }: CalendarPopoverProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<CalendarEvent['type']>('appointment');

  const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
  const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const selectedDayEvents = events.filter(e => isSameDay(parseISO(e.date), selectedDate));

  const handleAdd = () => {
    if (!newTitle) return;
    onAddEvent({
      title: newTitle,
      description: '',
      date: selectedDate.toISOString(),
      type: newType,
    });
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="absolute top-full right-0 mt-4 w-[420px] bg-white rounded-[2.5rem] shadow-2xl border border-[#d0c5b6]/20 overflow-hidden z-[1100] flex flex-col">
      {/* Header */}
      <div className="p-8 bg-gradient-to-br from-[#f7f3f0] to-white border-b border-[#d0c5b6]/10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-serif italic text-2xl text-[#2d1b0d] capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#4d463a]/60 font-bold">Agenda Juridica Centralizada</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 rounded-full hover:bg-white transition-colors text-[#4d463a]/60"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 rounded-full hover:bg-white transition-colors text-[#4d463a]/60"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
            <div key={day} className="text-center text-[10px] font-bold text-[#4d463a]/40 uppercase tracking-widest py-2">
              {day}
            </div>
          ))}
          {days.map((day, idx) => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const hasEvents = events.some(e => isSameDay(parseISO(e.date), day));

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={`
                  relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all
                  ${isSelected ? 'bg-[#2d1b0d] text-white shadow-lg' : 'hover:bg-[#ebe7e4] text-[#1c1b1a]'}
                  ${!isCurrentMonth ? 'opacity-20' : ''}
                `}
              >
                <span className={isSelected ? 'font-bold' : 'font-medium'}>{format(day, 'd')}</span>
                {hasEvents && !isSelected && (
                  <div className="absolute bottom-1.5 w-1 h-1 bg-[#74572a] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 bg-white p-8 max-h-[300px] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-[#1c1b1a] text-sm uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-[#74572a] rounded-full" />
            Agenda para el {format(selectedDate, "d 'de' MMMM", { locale: es })}
          </h4>
          <button 
            onClick={() => setIsAdding(true)}
            className="p-2 bg-[#f7f3f0] rounded-full text-[#74572a] hover:bg-[#74572a] hover:text-white transition-all shadow-sm"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isAdding && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#f7f3f0] p-4 rounded-2xl border border-[#d0c5b6]/30 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#74572a]">Nuevo Evento</span>
                  <button onClick={() => setIsAdding(false)}><X size={14}/></button>
                </div>
                <input 
                  autoFocus
                  placeholder="Título de la cita o vista..."
                  className="w-full bg-white px-4 py-2 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#74572a]/20 outline-none"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {(['appointment', 'deadline', 'hearing', 'task'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setNewType(type)}
                      className={`
                        whitespace-nowrap px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors
                        ${newType === type ? 'bg-[#2d1b0d] text-white' : 'bg-white text-[#4d463a]/60 hover:bg-[#ebe7e4]'}
                      `}
                    >
                      {type === 'appointment' ? 'Cita' : 
                       type === 'deadline' ? 'Plazo' :
                       type === 'hearing' ? 'Vista' : 'Tarea'}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleAdd}
                  className="w-full bg-[#74572a] text-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                >
                  Programar Evento
                </button>
              </motion.div>
            )}
            
            {selectedDayEvents.length === 0 && !isAdding ? (
              <div className="py-8 text-center bg-[#fdf9f6] rounded-3xl border border-dashed border-[#d0c5b6]/40">
                <p className="text-xs text-[#4d463a]/40 italic font-medium">Sin eventos programados</p>
              </div>
            ) : (
              selectedDayEvents.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  className="group flex gap-4 p-4 rounded-2xl bg-white border border-[#d0c5b6]/10 hover:border-[#74572a]/20 hover:shadow-lg transition-all"
                >
                  <div className={`w-1 h-12 rounded-full shrink-0 ${
                    event.type === 'hearing' ? 'bg-red-500' :
                    event.type === 'deadline' ? 'bg-amber-500' :
                    event.type === 'appointment' ? 'bg-[#74572a]' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-sm text-[#1c1b1a] truncate">{event.title}</p>
                      <button className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-[#f7f3f0] transition-opacity">
                        <MoreVertical size={14} className="text-[#4d463a]/40" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 opacity-60">
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                        <Clock size={12} />
                        {event.time || 'flexible'}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                        <MapPin size={12} />
                        Despacho
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
