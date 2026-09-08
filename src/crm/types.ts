/* =========================================================================
   Aegis CRM — Layer 1 (Sales Work Capture) domain types.
   Mirrors the Developer System Design Blueprint §5–§14 ER model. Every
   tenant-owned record carries organizationId. Ids are strings (Guid).
   ========================================================================= */

export type Id = string;
export type IsoDate = string; // ISO 8601

// ---- Enums (blueprint §6, §9, §10) ----------------------------------------

export type ProspectStatus =
  | 'NEW'
  | 'ACTIVE'
  | 'FOLLOW_UP'
  | 'QUALIFICATION'
  | 'QUALIFIED'
  | 'DORMANT'
  | 'DISQUALIFIED'
  | 'CONVERTED';

export type Temperature = 'COLD' | 'WARM' | 'HOT';

export type ActivityType = 'CALL' | 'EMAIL' | 'NOTE' | 'CUSTOM';

export type ActivityOutcome =
  | 'CONTACTED'
  | 'NO_RESPONSE'
  | 'NOT_AVAILABLE'
  | 'MEETING_SCHEDULED'
  | 'FOLLOW_UP_REQUIRED'
  | 'NO_REQUIREMENT'
  | 'REQUIREMENT_EXPECTED'
  | 'BOQ_EXPECTED'
  | 'BOQ_RECEIVED'
  | 'NEGOTIATION'
  | 'OTHER';

export type TaskType = 'FOLLOW_UP' | 'GENERAL';
export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type DocumentRelation = 'BOQ' | 'PLAN' | 'DRAWING' | 'ATTACHMENT' | 'QUOTE';

export type RequirementFieldType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'NUMBER'
  | 'DATE'
  | 'BOOLEAN'
  | 'SELECT'
  | 'MULTISELECT';

export type TimelineEventType =
  | 'ProspectCreated'
  | 'ProspectUpdated'
  | 'ContactLinked'
  | 'ActivityLogged'
  | 'TaskCreated'
  | 'TaskCompleted'
  | 'MeetingScheduled'
  | 'SiteVisitCompleted'
  | 'RequirementSubmitted'
  | 'DocumentUploaded'
  | 'ProspectStatusChanged'
  | 'TemperatureChanged'
  | 'ProspectConverted';

// ---- Core aggregate (blueprint §5) ---------------------------------------

export interface Prospect {
  id: Id;
  organizationId: Id;
  prospectNo: string;
  name: string;
  businessName?: string;
  description?: string;
  projectLocation?: string;
  officeLocation?: string;
  ownerEmployeeId: Id;
  ownerName: string;
  status: ProspectStatus;
  sourceId?: Id;
  source?: string;
  temperature?: Temperature;
  projectProgress?: string; // dynamic: "Excavation", "3rd slab", "Under construction"…
  estimatedValue?: number;
  discoveredAt: IsoDate;
  expectedDecisionDate?: IsoDate;
  createdAt: IsoDate;
  updatedAt?: IsoDate;
  convertedOpportunityId?: Id;
  /** Commercial outcome (blueprint §2, §6) — set when status → DISQUALIFIED. */
  lossReason?: string;
  closedAt?: IsoDate; // when it reached a terminal state (CONVERTED / DISQUALIFIED)
}

/** A salesperson / team target for a period (blueprint §23 — a separate module,
    never stored on Employee). */
export interface SalesTarget {
  id: Id;
  organizationId: Id;
  ownerEmployeeId: Id;
  ownerName: string;
  period: string; // "2026-Q3"
  metric: 'WON_VALUE' | 'QUALIFIED_COUNT' | 'ACTIVITY_COUNT';
  target: number;
}

export interface TeamMember {
  employeeId: Id;
  name: string;
  role: 'SALES' | 'MARKETING' | 'MANAGER' | 'DIRECTOR';
}

export interface ProspectStatusHistory {
  id: Id;
  prospectId: Id;
  fromStatus: ProspectStatus | null;
  toStatus: ProspectStatus;
  changedByName: string;
  reason?: string;
  changedAt: IsoDate;
}

// ---- People (blueprint §8) ---------------------------------------------

export interface Contact {
  id: Id;
  organizationId: Id;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  jobTitle?: string;
  department?: string;
}

export interface ProspectContact {
  id: Id;
  prospectId: Id;
  contactId: Id;
  contact: Contact;
  role: string; // Site Engineer, Purchase Manager, Decision Maker…
  isPrimary: boolean;
  notes?: string;
}

// ---- Work records (blueprint §9–§11) ----------------------------------

export interface Activity {
  id: Id;
  organizationId: Id;
  prospectId: Id;
  type: ActivityType;
  outcome: ActivityOutcome;
  subject?: string;
  notes?: string;
  contactId?: Id;
  occurredAt: IsoDate;
  createdByName: string;
}

export interface Task {
  id: Id;
  organizationId: Id;
  prospectId: Id;
  prospectName: string;
  title: string;
  description?: string;
  type: TaskType;
  assignedToName: string;
  dueAt: IsoDate;
  priority: TaskPriority;
  status: TaskStatus;
  completedAt?: IsoDate;
  createdFromActivityId?: Id;
  createdAt: IsoDate;
}

export interface MeetingParticipant {
  name: string;
  kind: 'EMPLOYEE' | 'CONTACT';
}

export interface Meeting {
  id: Id;
  organizationId: Id;
  prospectId: Id;
  prospectName: string;
  title: string;
  startAt: IsoDate;
  endAt?: IsoDate;
  location?: string;
  agenda?: string;
  notes?: string;
  outcome?: string;
  participants: MeetingParticipant[];
  createdAt: IsoDate;
}

export interface SiteVisitPhoto {
  id: Id;
  name: string;
  dataUrl: string; // local preview
}

export interface SiteVisit {
  id: Id;
  organizationId: Id;
  prospectId: Id;
  prospectName: string;
  visitAt: IsoDate;
  location?: string;
  purpose?: string;
  peopleMet: string[];
  summary?: string;
  notes?: string;
  photos: SiteVisitPhoto[];
  requirementResponseId?: Id;
  nextTaskId?: Id;
  completed: boolean;
  createdAt: IsoDate;
}

// ---- Dynamic requirements (blueprint §12) -----------------------------

export interface RequirementQuestion {
  id: Id;
  code: string;
  label: string;
  fieldType: RequirementFieldType;
  isRequired: boolean;
  options?: string[];
  helpText?: string;
  displayOrder: number;
}

export interface RequirementSection {
  id: Id;
  name: string;
  displayOrder: number;
  questions: RequirementQuestion[];
}

export interface RequirementTemplate {
  id: Id;
  organizationId: Id;
  name: string;
  version: number;
  isPublished: boolean;
  sections: RequirementSection[];
}

export type RequirementAnswerValue = string | number | boolean | string[] | null;

export interface RequirementResponse {
  id: Id;
  organizationId: Id;
  templateId: Id;
  templateName: string;
  templateVersion: number;
  prospectId: Id;
  context?: string; // e.g. "Site Visit"
  status: 'DRAFT' | 'SUBMITTED';
  answers: Record<string, RequirementAnswerValue>; // questionId -> value
  submittedAt?: IsoDate;
  createdAt: IsoDate;
}

// ---- Documents / BOQ (blueprint §13) ---------------------------------

export interface CrmDocument {
  id: Id;
  organizationId: Id;
  prospectId: Id;
  fileName: string;
  mimeType?: string;
  size?: number;
  relation: DocumentRelation;
  versionNo: number;
  previousVersionId?: Id;
  note?: string;
  uploadedByName: string;
  uploadedAt: IsoDate;
}

// ---- Timeline (blueprint §14) ---------------------------------------

export interface TimelineEvent {
  id: Id;
  organizationId: Id;
  prospectId: Id;
  eventType: TimelineEventType;
  actorName: string;
  occurredAt: IsoDate;
  title: string;
  summary?: string;
}

// ---- Aggregated detail view (GET /api/prospects/{id}) -----------------

export interface ProspectDetail {
  prospect: Prospect;
  statusHistory: ProspectStatusHistory[];
  contacts: ProspectContact[];
  activities: Activity[];
  tasks: Task[];
  meetings: Meeting[];
  siteVisits: SiteVisit[];
  requirementResponses: RequirementResponse[];
  documents: CrmDocument[];
  timeline: TimelineEvent[];
}
