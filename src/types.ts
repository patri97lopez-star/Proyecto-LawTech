/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EmailType = 'notificación judicial' | 'aviso de licitación' | 'consulta de cliente' | 'recordatorio de plazo';
export type ProcedureType = 'civil' | 'penal' | 'laboral' | 'administrativo' | 'otros';
export type TenderType = 'pública' | 'privada' | 'subasta' | 'otros';

export type UserRole = 'socio' | 'abogado' | 'administrativo' | 'lector';

export interface UserProfile {
  uid: string;
  role: UserRole;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface LegalDocument {
  id: string;
  name: string;
  type: string; // pdf, docx, etc
  category: 'contrato' | 'escrito' | 'notificación' | 'anexo' | 'otros';
  folder?: string;
  url: string;
  clientId?: string;
  caseId?: string;
  tags: string[];
  extractedText?: string; // OCR Result
  status: 'borrador' | 'revisión' | 'aprobado' | 'oficial';
  userId: string;
  createdAt: number;
}

export interface LegalTemplate {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'email' | 'demanda' | 'minuta' | 'burofax' | 'factura' | 'escrito';
  createdAt: number;
  updatedAt: number;
}

export interface AuditLog {
  id: string;
  action: 'create' | 'update' | 'archive' | 'delete' | 'export';
  entityType: 'client' | 'case' | 'email' | 'document' | 'invoice' | 'tender';
  entityId: string;
  userName: string;
  userEmail: string;
  details: string;
  createdAt: number;
}

export interface LegalTask {
  id: string;
  title: string;
  description: string;
  caseId?: string;
  clientId?: string;
  assigneeId: string;
  assigneeName: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done';
  createdAt: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: 'email_received' | 'invoice_created' | 'case_updated';
  condition?: string;
  action: 'create_task' | 'send_notification' | 'update_status';
  isActive: boolean;
}

export interface EmailRecord {
  id: string;
  senderEmail?: string;
  senderName?: string;
  subject: string;
  type: EmailType;
  body: string;
  summary?: string;
  classification?: string;
  suggestedDraft?: string;
  extractedEntities?: string[]; // Automation: related clients/cases
  status: 'pendiente' | 'revisión' | 'aprobado' | 'rechazado';
  clientId?: string;
  caseId?: string;
  userId?: string;
  createdAt: number;
}

export interface JudicialMinute {
  id: string;
  procedureType: ProcedureType;
  date: string;
  parties: string;
  keyPoints: string;
  caseId?: string;
  structuredMinute?: {
    header: string;
    facts: string;
    allegations: string;
    decisions: string;
    nextSteps: string;
  };
  userId?: string;
  createdAt: number;
}

export interface TenderRecord {
  id: string;
  type: TenderType;
  organization: string;
  deadlines: string;
  requirements: string;
  summaryTable?: string;
  tasks?: string[];
  presentationDraft?: string;
  caseId?: string;
  userId?: string;
  createdAt: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // e.g. 0.21
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  clientId?: string;
  clientName: string;
  caseId?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  totalAmount: number;
  totalTax: number;
  notes?: string;
  userId?: string;
  createdAt: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  type: 'judicial' | 'tender' | 'billing' | 'system';
  isArchived: boolean;
  userId?: string;
  createdAt: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  time?: string;
  duration?: number; // minutes
  type: 'appointment' | 'deadline' | 'hearing' | 'task';
  userId?: string;
  createdAt: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  taxId?: string; // DNI/CIF
  type: 'individual' | 'company';
  caseCount: number;
  totalBilled: number;
  status: 'active' | 'inactive';
  notes?: string;
  userId?: string;
  createdAt: number;
}

export interface LegalCase {
  id: string;
  referenceNumber: string; // Num. Expediente
  title: string;
  clientId: string;
  clientName: string;
  type: 'civil' | 'penal' | 'laboral' | 'administrativo' | 'mercantil';
  status: 'open' | 'closed' | 'archived' | 'pending';
  description: string;
  courtName?: string;
  judgeName?: string;
  documents?: string[];
  userId?: string;
  createdAt: number;
  updatedAt: number;
}
