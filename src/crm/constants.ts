/* =========================================================================
   Aegis CRM — Layer 1 display metadata: labels, colours, allowed transitions.
   Colours are semantic-token variants understood by <Badge>.
   ========================================================================= */

import type {
  ActivityOutcome,
  ActivityType,
  DocumentRelation,
  ProspectStatus,
  TaskPriority,
  TaskStatus,
  Temperature,
} from './types';
import type { BadgeVariant } from '../components/ui/Badge';

// ---- Prospect status (blueprint §6 state machine) ------------------------

export const STATUS_LABEL: Record<ProspectStatus, string> = {
  NEW: 'New',
  ACTIVE: 'Active',
  FOLLOW_UP: 'Follow-up',
  QUALIFICATION: 'Qualification',
  QUALIFIED: 'Qualified',
  DORMANT: 'Dormant',
  DISQUALIFIED: 'Disqualified',
  CONVERTED: 'Converted',
};

export const STATUS_VARIANT: Record<ProspectStatus, BadgeVariant> = {
  NEW: 'neutral',
  ACTIVE: 'info',
  FOLLOW_UP: 'warning',
  QUALIFICATION: 'brand',
  QUALIFIED: 'success',
  DORMANT: 'neutral',
  DISQUALIFIED: 'danger',
  CONVERTED: 'success',
};

/** Allowed forward transitions from the state machine (Figure 6). */
export const STATUS_TRANSITIONS: Record<ProspectStatus, ProspectStatus[]> = {
  NEW: ['ACTIVE', 'DISQUALIFIED'],
  ACTIVE: ['FOLLOW_UP', 'QUALIFICATION', 'DORMANT', 'DISQUALIFIED'],
  FOLLOW_UP: ['ACTIVE', 'QUALIFICATION', 'DORMANT', 'DISQUALIFIED'],
  QUALIFICATION: ['QUALIFIED', 'DISQUALIFIED', 'FOLLOW_UP'],
  QUALIFIED: ['CONVERTED', 'DISQUALIFIED'],
  DORMANT: ['ACTIVE', 'DISQUALIFIED'],
  DISQUALIFIED: ['ACTIVE'],
  CONVERTED: [],
};

/** Statuses counted as an "active working set" for dashboards (blueprint §18). */
export const ACTIVE_STATUSES: ProspectStatus[] = [
  'NEW',
  'ACTIVE',
  'FOLLOW_UP',
  'QUALIFICATION',
  'QUALIFIED',
];

export const STATUS_ORDER: ProspectStatus[] = [
  'NEW',
  'ACTIVE',
  'FOLLOW_UP',
  'QUALIFICATION',
  'QUALIFIED',
  'CONVERTED',
  'DORMANT',
  'DISQUALIFIED',
];

// ---- Temperature (separate dimension, blueprint §6) ----------------------

export const TEMPERATURE_LABEL: Record<Temperature, string> = {
  COLD: 'Cold',
  WARM: 'Warm',
  HOT: 'Hot',
  NOT_SET: 'Not Set',
};

export const TEMPERATURE_META: Record<
  Temperature,
  { label: string; icon: string; className: string }
> = {
  COLD: { label: 'Cold', icon: 'bi-snow2', className: 'text-info' },
  WARM: { label: 'Warm', icon: 'bi-thermometer-half', className: 'text-warning' },
  HOT: { label: 'Hot', icon: 'bi-fire', className: 'text-danger' },
  NOT_SET: { label: 'Not Set', icon: 'bi-dash-circle', className: 'text-muted-foreground' },
};

// ---- Activities (blueprint §9) ------------------------------------------

export const ACTIVITY_TYPE_META: Record<ActivityType, { label: string; icon: string }> = {
  CALL: { label: 'Call', icon: 'bi-telephone' },
  EMAIL: { label: 'Email', icon: 'bi-envelope' },
  NOTE: { label: 'Note', icon: 'bi-sticky' },
  CUSTOM: { label: 'Custom', icon: 'bi-asterisk' },
};

export const ACTIVITY_OUTCOME_LABEL: Record<ActivityOutcome, string> = {
  CONTACTED: 'Contacted',
  NO_RESPONSE: 'No response',
  NOT_AVAILABLE: 'Not available',
  MEETING_SCHEDULED: 'Meeting scheduled',
  FOLLOW_UP_REQUIRED: 'Follow-up required',
  NO_REQUIREMENT: 'No requirement',
  REQUIREMENT_EXPECTED: 'Requirement expected',
  BOQ_EXPECTED: 'BOQ expected',
  BOQ_RECEIVED: 'BOQ received',
  NEGOTIATION: 'Negotiation',
  OTHER: 'Other',
};

/** Outcome -> downstream behaviour the composer should offer (blueprint §9.1). */
export const OUTCOME_FOLLOW_UP: Partial<Record<ActivityOutcome, 'TASK' | 'MEETING'>> = {
  FOLLOW_UP_REQUIRED: 'TASK',
  BOQ_EXPECTED: 'TASK',
  REQUIREMENT_EXPECTED: 'TASK',
  MEETING_SCHEDULED: 'MEETING',
};

// ---- Tasks (blueprint §10) --------------------------------------------

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const TASK_STATUS_VARIANT: Record<TaskStatus, BadgeVariant> = {
  OPEN: 'info',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'neutral',
};

export const TASK_PRIORITY_META: Record<
  TaskPriority,
  { label: string; variant: BadgeVariant }
> = {
  LOW: { label: 'Low', variant: 'neutral' },
  MEDIUM: { label: 'Medium', variant: 'info' },
  HIGH: { label: 'High', variant: 'warning' },
  URGENT: { label: 'Urgent', variant: 'danger' },
};

// ---- Documents (blueprint §13) ---------------------------------------

export const DOCUMENT_RELATION_META: Record<
  DocumentRelation,
  { label: string; icon: string }
> = {
  BOQ: { label: 'BOQ', icon: 'bi-file-earmark-spreadsheet' },
  PLAN: { label: 'Plan', icon: 'bi-file-earmark-ruled' },
  DRAWING: { label: 'Drawing', icon: 'bi-file-earmark-image' },
  QUOTE: { label: 'Quote', icon: 'bi-file-earmark-text' },
  ATTACHMENT: { label: 'Attachment', icon: 'bi-paperclip' },
};

// ---- Reference lists -------------------------------------------------

export const CONTACT_ROLES = [
  'Decision Maker',
  'Purchase Manager',
  'Site Engineer',
  'Contractor',
  'Architect',
  'Consultant',
  'Finance',
  'Other',
];

export const PROSPECT_SOURCES = [
  'Site Information',
  'Social Media',
  'Referral',
  'Cold Calling',
  'Exhibition',
  'Existing Client',
  'Website',
  'Other',
];

/** Why business is lost (blueprint §2, §18.1) — standardized so it can be
    reported while notes stay free-form. */
export const LOSS_REASONS = [
  'Price too high',
  'Lost to competitor',
  'Budget cut / on hold',
  'No decision (stalled)',
  'Timeline mismatch',
  'Spec / technical fit',
  'No response',
  'Wrong contact / not a fit',
  'Other',
];

export const PROJECT_PROGRESS_OPTIONS = [
  'Not started',
  'Land acquired',
  'Excavation',
  'Foundation',
  '1st slab',
  '2nd slab',
  '3rd slab',
  'Superstructure',
  'Under construction',
  'Finishing',
  'Ready',
];
