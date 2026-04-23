/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, 
  Mail, 
  FileText, 
  Gavel, 
  LayoutDashboard, 
  Plus, 
  Bell, 
  Calendar as CalendarIcon,
  Search,
  Settings,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Receipt,
  User as UserIcon,
  Loader2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import EmailsSection from './components/EmailsSection';
import MinutesSection from './components/MinutesSection';
import TendersSection from './components/TendersSection';
import BillingSection from './components/BillingSection';
import Dashboard from './components/Dashboard';
import SettingsSection from './components/SettingsSection';
import LegalChatbot from './components/LegalChatbot';
import LoginPage from './components/LoginPage';
import NotificationPopover from './components/NotificationPopover';
import CalendarPopover from './components/CalendarPopover';
import ClientsSection from './components/ClientsSection';
import CasesSection from './components/CasesSection';
import DocumentsSection from './components/DocumentsSection';
import TemplatesSection from './components/TemplatesSection';
import SecuritySection from './components/SecuritySection';
import TasksSection from './components/TasksSection';
import LawTechLogo from './components/LawTechLogo';
import { useAuth } from './contexts/AuthContext';
import { 
  EmailRecord, 
  JudicialMinute, 
  TenderRecord, 
  InvoiceRecord, 
  AppNotification, 
  CalendarEvent, 
  Client, 
  LegalCase,
  LegalDocument,
  LegalTemplate,
  AuditLog,
  UserProfile,
  LegalTask,
  AutomationRule
} from './types';
import { db } from './lib/firebase';
import { collection, onSnapshot, query, addDoc, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Users, FolderOpen } from 'lucide-react';

export default function App() {
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [minutes, setMinutes] = useState<JudicialMinute[]>([]);
  const [tenders, setTenders] = useState<TenderRecord[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [templates, setTemplates] = useState<LegalTemplate[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [tasks, setTasks] = useState<LegalTask[]>([]);
  const [automationRules, setAutomationRules] = useState<any[]>([]);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // UI Popover states
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Sync data with Firestore when user is logged in
  useEffect(() => {
    if (!user) {
      setEmails([]);
      setMinutes([]);
      setTenders([]);
      setInvoices([]);
      setNotifications([]);
      setEvents([]);
      setClients([]);
      setCases([]);
      setTasks([]);
      return;
    }

    // Real-time listeners for each collection
    const qTasks = query(collection(db, `users/${user.uid}/tasks`));
    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
      setTasks(snapshot.docs.map(doc => doc.data() as LegalTask));
    });

    const qRules = query(collection(db, `users/${user.uid}/automationRules`));
    const unsubRules = onSnapshot(qRules, (snapshot) => {
      setAutomationRules(snapshot.docs.map(doc => doc.data() as AutomationRule));
    });
    const qEmails = query(collection(db, `users/${user.uid}/emails`));
    const unsubEmails = onSnapshot(qEmails, (snapshot) => {
      setEmails(snapshot.docs.map(doc => doc.data() as EmailRecord));
    });

    const qMinutes = query(collection(db, `users/${user.uid}/minutes`));
    const unsubMinutes = onSnapshot(qMinutes, (snapshot) => {
      setMinutes(snapshot.docs.map(doc => doc.data() as JudicialMinute));
    });

    const qTenders = query(collection(db, `users/${user.uid}/tenders`));
    const unsubTenders = onSnapshot(qTenders, (snapshot) => {
      setTenders(snapshot.docs.map(doc => doc.data() as TenderRecord));
    });

    const qInvoices = query(collection(db, `users/${user.uid}/invoices`));
    const unsubInvoices = onSnapshot(qInvoices, (snapshot) => {
      setInvoices(snapshot.docs.map(doc => doc.data() as InvoiceRecord));
    });

    const qNotifs = query(collection(db, `users/${user.uid}/notifications`));
    const unsubNotifs = onSnapshot(qNotifs, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => doc.data() as AppNotification));
    });

    const qEvents = query(collection(db, `users/${user.uid}/events`));
    const unsubEvents = onSnapshot(qEvents, (snapshot) => {
      setEvents(snapshot.docs.map(doc => doc.data() as CalendarEvent));
    });

    const qClients = query(collection(db, `users/${user.uid}/clients`));
    const unsubClients = onSnapshot(qClients, (snapshot) => {
      setClients(snapshot.docs.map(doc => doc.data() as Client));
    });

    const qCases = query(collection(db, `users/${user.uid}/cases`));
    const unsubCases = onSnapshot(qCases, (snapshot) => {
      setCases(snapshot.docs.map(doc => doc.data() as LegalCase));
    });

    const qDocs = query(collection(db, `users/${user.uid}/documents`));
    const unsubDocs = onSnapshot(qDocs, (snapshot) => {
      setDocuments(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as LegalDocument)));
    });

    const qTemplates = query(collection(db, `users/${user.uid}/templates`));
    const unsubTemplates = onSnapshot(qTemplates, (snapshot) => {
      setTemplates(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as LegalTemplate)));
    });

    const qLogs = query(collection(db, `users/${user.uid}/auditLogs`));
    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      setAuditLogs(snapshot.docs.map(doc => doc.data() as AuditLog));
    });

    const qTeam = query(collection(db, `users/${user.uid}/teamMembers`));
    const unsubTeam = onSnapshot(qTeam, (snapshot) => {
      setTeamMembers(snapshot.docs.map(doc => doc.data() as UserProfile));
    });

    // --- Automation Engine Simulator ---
    // Check for critical deadlines every minute (simulated logic)
    const checkDeadlines = () => {
      const now = Date.now();
      tasks.forEach(task => {
        if (task.status !== 'done' && task.dueDate - now < 86400000 && task.dueDate > now) {
          // If due within 24h, ensure notification exists
          const exists = notifications.some(n => n.type === 'deadline' && n.details.includes(task.title));
          if (!exists) {
            addDoc(collection(db, `users/${user.uid}/notifications`), {
              userId: user.uid,
              type: 'deadline',
              title: 'PLAZO CRÍTICO',
              details: `La tarea "${task.title}" vence en menos de 24 horas.`,
              priority: 'high',
              isArchived: false,
              createdAt: now
            });
          }
        }
      });
    };
    checkDeadlines();

    return () => {
      unsubEmails();
      unsubMinutes();
      unsubTenders();
      unsubInvoices();
      unsubNotifs();
      unsubEvents();
      unsubClients();
      unsubCases();
      unsubTasks();
      unsubRules();
      unsubDocs();
      unsubTemplates();
      unsubLogs();
      unsubTeam();
    };
  }, [user]);

  // Firestore Write Wrappers
  const handleAddEmail = async (newEmails: EmailRecord[] | ((prev: EmailRecord[]) => EmailRecord[])) => {
    if (!user) return;
    const latest = typeof newEmails === 'function' ? newEmails(emails) : newEmails;
    const added = latest.find(e => !emails.find(ex => ex.id === e.id));
    if (added) {
      await setDoc(doc(db, `users/${user.uid}/emails`, added.id), { ...added, userId: user.uid });
    }
  };

  const handleAddMinute = async (newMinutes: JudicialMinute[] | ((prev: JudicialMinute[]) => JudicialMinute[])) => {
    if (!user) return;
    const latest = typeof newMinutes === 'function' ? newMinutes(minutes) : newMinutes;
    const added = latest.find(m => !minutes.find(ex => ex.id === m.id));
    if (added) {
      await setDoc(doc(db, `users/${user.uid}/minutes`, added.id), { ...added, userId: user.uid });
    }
  };

  const handleAddTender = async (newTenders: TenderRecord[] | ((prev: TenderRecord[]) => TenderRecord[])) => {
    if (!user) return;
    const latest = typeof newTenders === 'function' ? newTenders(tenders) : newTenders;
    const added = latest.find(t => !tenders.find(ex => ex.id === t.id));
    if (added) {
      await setDoc(doc(db, `users/${user.uid}/tenders`, added.id), { ...added, userId: user.uid });
    }
  };

  const handleAddInvoice = async (newInvoices: InvoiceRecord[] | ((prev: InvoiceRecord[]) => InvoiceRecord[])) => {
    if (!user) return;
    const latest = typeof newInvoices === 'function' ? newInvoices(invoices) : newInvoices;
    const added = latest.find(i => !invoices.find(ex => ex.id === i.id));
    if (added) {
      await setDoc(doc(db, `users/${user.uid}/invoices`, added.id), { ...added, userId: user.uid });
    }
  };

  const handleAddClient = async (newClients: Client[] | ((prev: Client[]) => Client[])) => {
    if (!user) return;
    const latest = typeof newClients === 'function' ? newClients(clients) : newClients;
    const added = latest.find(c => !clients.find(ex => ex.id === c.id));
    if (added) {
      await setDoc(doc(db, `users/${user.uid}/clients`, added.id), { ...added, userId: user.uid });
    }
  };

  const handleAddCase = async (newCases: LegalCase[] | ((prev: LegalCase[]) => LegalCase[])) => {
    if (!user) return;
    const latest = typeof newCases === 'function' ? newCases(cases) : newCases;
    const added = latest.find(c => !cases.find(ex => ex.id === c.id));
    if (added) {
      await setDoc(doc(db, `users/${user.uid}/cases`, added.id), { ...added, userId: user.uid });
    }
  };

  const handleArchiveNotification = async (id: string) => {
    if (!user) return;
    await updateDoc(doc(db, `users/${user.uid}/notifications`, id), { isArchived: true });
  };

  const handleDeleteNotification = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, `users/${user.uid}/notifications`, id));
  };

  const handleAddEvent = async (eventData: Omit<CalendarEvent, 'id' | 'createdAt'>) => {
    if (!user) return;
    const id = crypto.randomUUID();
    const event: CalendarEvent = {
      ...eventData,
      id,
      userId: user.uid,
      createdAt: Date.now()
    };
    await setDoc(doc(db, `users/${user.uid}/events`, id), event);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf9f6] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#74572a]" size={40} />
        <p className="text-sm font-serif italic text-[#74572a]">Estableciendo conexión segura...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const navigation = [
    { id: 'dashboard', name: 'Escritorio', icon: LayoutDashboard },
    { id: 'tasks', name: 'Flujos y Tareas', icon: CheckCircle2 },
    { id: 'cases', name: 'Expedientes', icon: FolderOpen },
    { id: 'clients', name: 'Cartera Clientes', icon: Users },
    { id: 'emails', name: 'Correos IA', icon: Mail },
    { id: 'minutes', name: 'Actas Judiciales', icon: FileText },
    { id: 'tenders', name: 'Licitaciones', icon: Gavel },
    { id: 'billing', name: 'Facturación', icon: Receipt },
    { id: 'documents', name: 'Documentos', icon: FileText },
    { id: 'templates', name: 'Plantillas', icon: LayoutDashboard },
    { id: 'security', name: 'Seguridad', icon: UserIcon },
  ];

  return (
    <div className="flex min-h-screen bg-[#fdf9f6] text-[#1c1b1a] font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-[#f7f3f0] shadow-xl flex flex-col py-8 z-50 overflow-y-auto">
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="px-8 mb-10 flex items-center gap-3 cursor-pointer group"
        >
          <LawTechLogo size={64} />
          <div>
            <h1 className="font-serif italic text-2xl text-[#74572a]">LawTech</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#4d463a]/60 font-bold">Atelier Digital</p>
          </div>
        </div>

        <div className="px-6 mb-8">
          <div className="flex items-center gap-4 p-4 bg-[#ebe7e4] rounded-xl overflow-hidden">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#74572a] flex items-center justify-center text-white border-2 border-white shrink-0">
                <UserIcon size={20} />
              </div>
            )}
            <div className="overflow-hidden">
              <p className="font-semibold text-sm truncate">{user?.displayName || 'Abogado LawTech'}</p>
              <p className="text-[10px] text-[#4d463a] uppercase tracking-wider truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-8 py-4 transition-all duration-200 group relative
                ${activeTab === item.id 
                  ? 'text-[#74572a] bg-[#e5e2df] border-l-4 border-[#74572a] font-bold' 
                  : 'text-[#1c1b1a]/70 hover:bg-[#e5e2df] hover:text-[#74572a] border-l-4 border-transparent'
                }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-[#74572a]' : 'text-[#8c857d]'} />
              <span className="text-sm tracking-wide uppercase font-medium">{item.name}</span>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute right-0 w-1 h-8 bg-[#74572a] rounded-l-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="px-6 space-y-2 mt-4">
          <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-br from-[#2d1b0d] to-[#4a2c16] text-white text-xs font-bold uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-transform">
            <Plus size={16} />
            Nuevo Caso
          </button>
          
          <div className="pt-6 border-t border-[#d0c5b6]/30">
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-4 px-2 py-2 transition-colors ${activeTab === 'settings' ? 'text-[#74572a] font-bold' : 'text-[#1c1b1a]/50 hover:text-[#74572a]'}`}
            >
              <Settings size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Ajustes</span>
            </button>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-4 px-2 py-2 text-[#1c1b1a]/50 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Salir</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-12 overflow-y-auto min-h-screen relative">
        <header className="flex flex-col gap-10 mb-12">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              {activeTab !== 'dashboard' && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setActiveTab('dashboard')}
                  className="p-3 rounded-2xl bg-white border border-[#d0c5b6]/20 text-[#74572a] hover:bg-[#2d1b0d] hover:text-white transition-all shadow-sm hover:shadow-md group"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </motion.button>
              )}
              <div>
                <h2 className="text-4xl font-serif text-[#2d1b0d] capitalize mb-1">
                  {activeTab === 'settings' ? 'Ajustes' : navigation.find(n => n.id === activeTab)?.name}
                </h2>
                <p className="text-sm text-[#4d463a]/60 font-medium">Gestionando su despacho como {user?.displayName || 'Abogado'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#f7f3f0] p-1.5 rounded-full border border-[#d0c5b6]/20 shadow-sm">
              <div className="mr-1">
                <LegalChatbot />
              </div>

              <div className="relative">
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowCalendar(false);
                  }}
                  className={`p-2 rounded-full transition-colors relative ${showNotifications ? 'bg-white shadow-sm text-[#2d1b0d]' : 'hover:bg-white/80 text-[#4d463a]'}`}
                >
                  <Bell size={18} />
                  {notifications.filter(n => !n.isArchived).length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#fdf9f6]" />
                  )}
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    >
                      <NotificationPopover 
                        notifications={notifications}
                        onArchive={handleArchiveNotification}
                        onDelete={handleDeleteNotification}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <button 
                  onClick={() => {
                    setShowCalendar(!showCalendar);
                    setShowNotifications(false);
                  }}
                  className={`p-2 rounded-full transition-colors ${showCalendar ? 'bg-white shadow-sm text-[#2d1b0d]' : 'hover:bg-white/80 text-[#4d463a]'}`}
                >
                  <CalendarIcon size={18} />
                </button>
                <AnimatePresence>
                  {showCalendar && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    >
                      <CalendarPopover 
                        events={events}
                        onAddEvent={handleAddEvent}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="relative group max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4d463a]/40 group-focus-within:text-[#74572a] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Búsqueda Global (Clientes, Expedientes...)" 
              className="pl-12 pr-6 py-4 bg-white/50 border border-[#d0c5b6]/30 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-[#74572a]/20 w-full transition-all focus:bg-white shadow-sm hover:shadow-md cursor-pointer"
              onClick={() => setShowGlobalSearch(true)}
              readOnly
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#f7f3f0] border border-[#d0c5b6]/20 rounded-lg text-[10px] font-bold text-[#4d463a]/40 uppercase tracking-widest hidden md:block">
              Presione para buscar
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative z-20"
          >
            {activeTab === 'dashboard' && (
              <Dashboard 
                emails={emails} 
                minutes={minutes} 
                tenders={tenders} 
                notifications={notifications}
                invoices={invoices}
                cases={cases}
                clients={clients}
                tasks={tasks}
                onArchiveNotification={handleArchiveNotification}
                onSwitchTab={setActiveTab}
              />
            )}
            {/* ... other tabs ... */}
            {activeTab === 'tasks' && (
              <TasksSection 
                tasks={tasks} 
                automationRules={automationRules}
                onAddTask={() => {}} 
                onUpdateStatus={(id, s) => {
                  const taskRef = doc(db, `users/${user?.uid}/tasks`, id);
                  updateDoc(taskRef, { status: s });
                }} 
              />
            )}
            {activeTab === 'clients' && (
              <ClientsSection 
                clients={clients} 
                setClients={handleAddClient}
                emails={emails}
                cases={cases}
                invoices={invoices}
                tasks={tasks}
              />
            )}
            {activeTab === 'cases' && (
              <CasesSection 
                cases={cases} 
                setCases={handleAddCase}
                emails={emails}
              />
            )}
            {activeTab === 'emails' && (
              <EmailsSection 
                emails={emails} 
                setEmails={handleAddEmail} 
                clients={clients}
                cases={cases}
              />
            )}
            {activeTab === 'minutes' && (
              <MinutesSection minutes={minutes} setMinutes={handleAddMinute} />
            )}
            {activeTab === 'tenders' && (
              <TendersSection tenders={tenders} setTenders={handleAddTender} />
            )}
            {activeTab === 'billing' && (
              <BillingSection 
                invoices={invoices} 
                setInvoices={handleAddInvoice}
                clients={clients}
                cases={cases}
              />
            )}
            {activeTab === 'documents' && (
              <DocumentsSection 
                documents={documents} 
                onUpload={(d) => {
                  const docRef = doc(db, `users/${user?.uid}/documents`, d.id);
                  setDoc(docRef, d);
                }}
                onDelete={(id) => deleteDoc(doc(db, `users/${user?.uid}/documents`, id))}
                onUpdateStatus={(id, s) => updateDoc(doc(db, `users/${user?.uid}/documents`, id), { status: s })}
              />
            )}
            {activeTab === 'templates' && (
              <TemplatesSection 
                templates={templates} 
                onAdd={(t) => addDoc(collection(db, `users/${user?.uid}/templates`), t)}
                onUpdate={(id, t) => updateDoc(doc(db, `users/${user?.uid}/templates`, id), t)}
                onDelete={(id) => deleteDoc(doc(db, `users/${user?.uid}/templates`, id))}
              />
            )}
            {activeTab === 'security' && (
              <SecuritySection 
                auditLogs={auditLogs} 
                teamMembers={teamMembers} 
                onBackup={() => alert('Backup iniciado. Recibirá un enlace seguro por email.')}
                onRestore={() => alert('Restauración disponible desde el panel administrativo.')}
              />
            )}
            {activeTab === 'settings' && (
              <SettingsSection />
            )}

            {activeTab !== 'dashboard' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-20 pt-12 border-t border-[#d0c5b6]/20 flex justify-center"
              >
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-3 px-8 py-4 bg-white border border-[#d0c5b6]/20 rounded-2xl text-[#74572a] font-bold text-xs uppercase tracking-widest hover:bg-[#2d1b0d] hover:text-white transition-all shadow-sm hover:shadow-xl group"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  Volver al Escritorio Principal
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Paper texture overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] z-[100]" />
      </main>

      {/* Global Search Modal */}
      <AnimatePresence>
        {showGlobalSearch && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4 bg-[#2d1b0d]/40 backdrop-blur-sm"
            onClick={() => setShowGlobalSearch(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border border-[#d0c5b6]/30 overflow-hidden"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="p-8 border-b border-[#f7f3f0] flex items-center gap-6">
                <Search className="text-[#74572a]" size={32} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="¿Qué está buscando en el Atelier?" 
                  className="flex-1 bg-transparent border-none text-2xl font-serif italic text-[#2d1b0d] placeholder:text-[#d0c5b6] focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setShowGlobalSearch(false);
                  }}
                />
                <button 
                  onClick={() => setShowGlobalSearch(false)}
                  className="p-2 text-[#4d463a] hover:bg-[#f7f3f0] rounded-xl text-xs font-bold uppercase"
                >
                  ESC
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                {searchQuery.length < 2 ? (
                  <div className="py-12 text-center space-y-2">
                    <p className="text-[#4d463a]/40 text-sm font-medium">Empiece a escribir para buscar expedientes, clientes o documentos...</p>
                    <div className="flex justify-center gap-4 pt-4">
                      {['Facturas', 'Sentencias', 'Plazos', 'Licitaciones'].map(tag => (
                        <span key={tag} className="px-3 py-1 bg-[#f7f3f0] text-[#74572a] rounded-full text-[10px] font-bold uppercase tracking-widest">{tag}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 p-4">
                    {/* Clientes Section */}
                    {clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#d0c5b6] px-4">Resultados en Clientes</p>
                        {clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(c => (
                          <button key={c.id} onClick={() => { setActiveTab('clients'); setShowGlobalSearch(false); }} className="w-full flex items-center justify-between p-4 rounded-3xl hover:bg-[#f7f3f0] text-left group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">{c.name[0]}</div>
                              <div>
                                <p className="text-sm font-bold text-[#2d1b0d] group-hover:text-[#74572a]">{c.name}</p>
                                <p className="text-[10px] text-[#4d463a]/60 uppercase">{c.company || 'Particular'}</p>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-[#d0c5b6]" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Expedientes Section */}
                    {cases.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#d0c5b6] px-4">Resultados en Expedientes</p>
                        {cases.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).map(c => (
                          <button key={c.id} onClick={() => { setActiveTab('cases'); setShowGlobalSearch(false); }} className="w-full flex items-center justify-between p-4 rounded-3xl hover:bg-[#f7f3f0] text-left group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center"><FolderOpen size={20} /></div>
                              <div>
                                <p className="text-sm font-bold text-[#2d1b0d] group-hover:text-[#74572a]">{c.title}</p>
                                <p className="text-[10px] text-[#4d463a]/60 uppercase">Ref: {c.caseNumber}</p>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-[#d0c5b6]" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Documentos Section */}
                    {documents.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#d0c5b6] px-4">Resultados en Documentos</p>
                        {documents.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).map(d => (
                          <button key={d.id} onClick={() => { setActiveTab('documents'); setShowGlobalSearch(false); }} className="w-full flex items-center justify-between p-4 rounded-3xl hover:bg-[#f7f3f0] text-left group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><FileText size={20} /></div>
                              <div>
                                <p className="text-sm font-bold text-[#2d1b0d] group-hover:text-[#74572a]">{d.name}</p>
                                <p className="text-[10px] text-[#4d463a]/60 uppercase">{d.type}</p>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-[#d0c5b6]" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Empty State */}
                    {clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 &&
                     cases.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 &&
                     documents.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                      <div className="py-20 text-center space-y-4">
                        <AlertCircle className="mx-auto text-[#d0c5b6]" size={48} />
                        <p className="font-serif italic text-lg text-[#4d463a]/60">"No hemos podido localizar nada que coincida con esa referencia."</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 bg-[#f7f3f0] flex justify-between items-center">
                <p className="text-[9px] uppercase tracking-widest font-bold text-[#4d463a]/40 flex items-center gap-2">
                  <Sparkles size={12} className="text-amber-500" /> Búsqueda potenciada por Atelier IA
                </p>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2 text-[9px] font-bold text-[#4d463a]/60">
                      <kbd className="bg-white px-1.5 py-1 rounded shadow-sm">↵</kbd> Seleccionar
                   </div>
                   <div className="flex items-center gap-2 text-[9px] font-bold text-[#4d463a]/60">
                      <kbd className="bg-white px-1.5 py-1 rounded shadow-sm">esc</kbd> Cerrar
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

