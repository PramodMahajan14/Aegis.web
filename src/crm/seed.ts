/* =========================================================================
   Aegis CRM — demo seed data.

   Keeps the blueprint's hand-authored "ABC Tower / Raj" scenario (§7.1, §24.1)
   and adds a team of salespeople + a spread of prospects (won, lost, dormant,
   varied sources, spread over ~5 months) so the role-based management
   dashboards have a real picture to render.
   ========================================================================= */

import { CURRENT_ORG_ID, CURRENT_USER, uid } from './env';
import type {
  Activity,
  ActivityOutcome,
  ActivityType,
  Contact,
  CrmDocument,
  Meeting,
  Prospect,
  ProspectContact,
  ProspectStatus,
  ProspectStatusHistory,
  RequirementResponse,
  RequirementTemplate,
  SalesTarget,
  SiteVisit,
  Task,
  TeamMember,
  TimelineEvent,
} from './types';

const org = CURRENT_ORG_ID;
const actor = CURRENT_USER.name;

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};
const daysAhead = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(10, 0, 0, 0);
  return d.toISOString();
};

// ---- Team (blueprint §7) ----------------------------------------------

export const seedTeam: TeamMember[] = [
  { employeeId: 'emp-raj', name: 'Raj Malhotra', role: 'SALES' },
  { employeeId: 'emp-priya', name: 'Priya Nair', role: 'SALES' },
  { employeeId: 'emp-vikram', name: 'Vikram Singh', role: 'SALES' },
  { employeeId: 'emp-anjali', name: 'Anjali Rao', role: 'MANAGER' },
  { employeeId: 'emp-sonia', name: 'Sonia Kapoor', role: 'MARKETING' },
  { employeeId: 'emp-deepak', name: 'Deepak Mehta', role: 'DIRECTOR' },
];
const nameOf = (eid: string) => seedTeam.find((t) => t.employeeId === eid)!.name;

// ---- Targets (blueprint §23) ----------------------------------------

export const seedTargets: SalesTarget[] = [
  { id: 'tgt-raj', organizationId: org, ownerEmployeeId: 'emp-raj', ownerName: 'Raj Malhotra', period: 'This quarter', metric: 'WON_VALUE', target: 9000000 },
  { id: 'tgt-priya', organizationId: org, ownerEmployeeId: 'emp-priya', ownerName: 'Priya Nair', period: 'This quarter', metric: 'WON_VALUE', target: 8000000 },
  { id: 'tgt-vikram', organizationId: org, ownerEmployeeId: 'emp-vikram', ownerName: 'Vikram Singh', period: 'This quarter', metric: 'WON_VALUE', target: 6500000 },
];

// ---- Requirement template (blueprint §12) ---------------------------

export const seedTemplate: RequirementTemplate = {
  id: 'tpl-site-survey-v1',
  organizationId: org,
  name: 'Site Survey Requirement',
  version: 1,
  isPublished: true,
  sections: [
    {
      id: 'sec-project',
      name: 'Project',
      displayOrder: 1,
      questions: [
        { id: 'q-scope', code: 'SCOPE', label: 'Scope of work', fieldType: 'TEXTAREA', isRequired: true, displayOrder: 1 },
        { id: 'q-area', code: 'AREA', label: 'Built-up area (sq ft)', fieldType: 'NUMBER', isRequired: false, displayOrder: 2 },
        {
          id: 'q-progress',
          code: 'PROGRESS',
          label: 'Current construction stage',
          fieldType: 'SELECT',
          isRequired: true,
          options: ['Excavation', 'Foundation', '1st slab', '2nd slab', '3rd slab', 'Superstructure', 'Finishing'],
          displayOrder: 3,
        },
      ],
    },
    {
      id: 'sec-commercial',
      name: 'Commercial',
      displayOrder: 2,
      questions: [
        { id: 'q-budget', code: 'BUDGET', label: 'Indicative budget (₹)', fieldType: 'NUMBER', isRequired: false, displayOrder: 1 },
        { id: 'q-boq', code: 'BOQ_READY', label: 'BOQ available?', fieldType: 'BOOLEAN', isRequired: true, displayOrder: 2 },
        {
          id: 'q-timeline',
          code: 'TIMELINE',
          label: 'Expected order timeline',
          fieldType: 'SELECT',
          isRequired: false,
          options: ['This month', '1–3 months', '3–6 months', '6+ months'],
          displayOrder: 3,
        },
      ],
    },
    {
      id: 'sec-decision',
      name: 'Decision process',
      displayOrder: 3,
      questions: [
        { id: 'q-dm', code: 'DECISION_MAKER', label: 'Who signs off?', fieldType: 'TEXT', isRequired: true, displayOrder: 1 },
        { id: 'q-competitors', code: 'COMPETITORS', label: 'Other vendors in the running', fieldType: 'TEXT', isRequired: false, helpText: 'Comma separated', displayOrder: 2 },
        { id: 'q-visit-notes', code: 'NOTES', label: 'Surveyor notes', fieldType: 'TEXTAREA', isRequired: false, displayOrder: 3 },
      ],
    },
  ],
};

// ---- Contacts (ABC Tower) ------------------------------------------

const cAmit: Contact = { id: 'c-amit', organizationId: org, firstName: 'Amit', lastName: 'Patil', phone: '+91 98200 11223', email: 'amit.patil@abctower.in', jobTitle: 'Site Engineer' };
const cRahul: Contact = { id: 'c-rahul', organizationId: org, firstName: 'Rahul', lastName: 'Shah', phone: '+91 98200 44556', email: 'rahul.shah@abctower.in', jobTitle: 'Purchase Manager' };
const cSuresh: Contact = { id: 'c-suresh', organizationId: org, firstName: 'Suresh', lastName: 'Kulkarni', phone: '+91 98200 77889', jobTitle: 'Director' };
const cNeha: Contact = { id: 'c-neha', organizationId: org, firstName: 'Neha', lastName: 'Verma', phone: '+91 99300 12345', email: 'neha@greenfield.co', jobTitle: 'Architect' };

// ---- Prospect generator ---------------------------------------------

interface Cfg {
  id: string;
  no: string;
  name: string;
  businessName: string;
  owner: string; // employeeId
  status: ProspectStatus;
  source: string;
  location: string;
  value: number;
  temp?: Prospect['temperature'];
  progress?: string;
  discAgo: number; // days
  closeAgo?: number; // days (terminal)
  lossReason?: string;
}

const CFG: Cfg[] = [
  { id: 'p-abc-tower', no: 'PRS-0001', name: 'ABC Tower', businessName: 'ABC Constructions Pvt Ltd', owner: 'emp-raj', status: 'QUALIFICATION', source: 'Site Information', location: 'Baner, Pune', value: 4200000, temp: 'HOT', progress: '3rd slab', discAgo: 32 },
  { id: 'p-greenfield', no: 'PRS-0002', name: 'Greenfield Mall Expansion', businessName: 'Greenfield Realty', owner: 'emp-raj', status: 'FOLLOW_UP', source: 'Referral', location: 'Hinjewadi, Pune', value: 1800000, temp: 'WARM', progress: 'Finishing', discAgo: 20 },
  { id: 'p-skyline', no: 'PRS-0003', name: 'Skyline Corporate Park', businessName: 'Skyline Infra', owner: 'emp-raj', status: 'ACTIVE', source: 'Cold Calling', location: 'Kharadi, Pune', value: 6500000, temp: 'COLD', progress: 'Excavation', discAgo: 6 },
  { id: 'p-riverside', no: 'PRS-0004', name: 'Riverside Villas', businessName: 'Sunrise Developers', owner: 'emp-raj', status: 'CONVERTED', source: 'Existing Client', location: 'Wakad, Pune', value: 2400000, temp: 'HOT', discAgo: 70, closeAgo: 34 },
  { id: 'p-metroplaza', no: 'PRS-0005', name: 'Metro Plaza', businessName: 'Metro Buildcon', owner: 'emp-priya', status: 'QUALIFIED', source: 'Exhibition', location: 'Viman Nagar, Pune', value: 5500000, temp: 'HOT', progress: 'Superstructure', discAgo: 26 },
  { id: 'p-harmony', no: 'PRS-0006', name: 'Harmony Residency', businessName: 'Harmony Group', owner: 'emp-priya', status: 'CONVERTED', source: 'Referral', location: 'Bavdhan, Pune', value: 3100000, temp: 'HOT', discAgo: 92, closeAgo: 40 },
  { id: 'p-orchid', no: 'PRS-0007', name: 'Orchid Enclave', businessName: 'Orchid Homes', owner: 'emp-vikram', status: 'DISQUALIFIED', source: 'Website', location: 'Wagholi, Pune', value: 1200000, temp: 'COLD', discAgo: 74, closeAgo: 30, lossReason: 'Lost to competitor' },
  { id: 'p-summit', no: 'PRS-0008', name: 'Summit Business Bay', businessName: 'Summit Realty', owner: 'emp-vikram', status: 'ACTIVE', source: 'Cold Calling', location: 'Balewadi, Pune', value: 9000000, temp: 'WARM', progress: 'Foundation', discAgo: 14 },
  { id: 'p-lakeview', no: 'PRS-0009', name: 'Lakeview Heights', businessName: 'Lakeview Developers', owner: 'emp-raj', status: 'DISQUALIFIED', source: 'Social Media', location: 'Pashan, Pune', value: 2000000, temp: 'COLD', discAgo: 100, closeAgo: 58, lossReason: 'Budget cut / on hold' },
  { id: 'p-techpark', no: 'PRS-0010', name: 'TechPark Phase 2', businessName: 'Innova Estates', owner: 'emp-priya', status: 'DORMANT', source: 'Website', location: 'Hinjewadi, Pune', value: 4000000, temp: 'COLD', discAgo: 118, progress: '2nd slab' },
  { id: 'p-crescent', no: 'PRS-0011', name: 'Crescent Court', businessName: 'Crescent Builders', owner: 'emp-vikram', status: 'CONVERTED', source: 'Existing Client', location: 'Aundh, Pune', value: 2800000, temp: 'HOT', discAgo: 120, closeAgo: 84 },
  { id: 'p-pinnacle', no: 'PRS-0012', name: 'Pinnacle One', businessName: 'Pinnacle Infratech', owner: 'emp-priya', status: 'FOLLOW_UP', source: 'Exhibition', location: 'Baner, Pune', value: 4800000, temp: 'WARM', progress: '1st slab', discAgo: 10 },
];

const STAGE_SEQ: ProspectStatus[] = ['NEW', 'ACTIVE', 'FOLLOW_UP', 'QUALIFICATION', 'QUALIFIED', 'CONVERTED'];

function historyFor(c: Cfg): ProspectStatusHistory[] {
  const owner = nameOf(c.owner);
  const out: ProspectStatusHistory[] = [];
  const targetIdx =
    c.status === 'DISQUALIFIED' || c.status === 'DORMANT'
      ? STAGE_SEQ.length - 2 // walked most of the way then dropped
      : STAGE_SEQ.indexOf(c.status);
  const span = c.discAgo - (c.closeAgo ?? 2);
  const steps = Math.max(1, targetIdx);
  let prev: ProspectStatus | null = null;
  for (let i = 0; i <= Math.min(targetIdx, STAGE_SEQ.length - 1); i++) {
    const to = STAGE_SEQ[i];
    if (c.status === 'DISQUALIFIED' && i === targetIdx) break; // handled below
    out.push({
      id: uid(),
      prospectId: c.id,
      fromStatus: prev,
      toStatus: to,
      changedByName: owner,
      changedAt: daysAgo(Math.round(c.discAgo - (span * i) / steps)),
    });
    prev = to;
  }
  if (c.status === 'DISQUALIFIED') {
    out.push({ id: uid(), prospectId: c.id, fromStatus: prev, toStatus: 'DISQUALIFIED', changedByName: owner, reason: c.lossReason, changedAt: daysAgo(c.closeAgo ?? 2) });
  } else if (c.status === 'DORMANT') {
    out.push({ id: uid(), prospectId: c.id, fromStatus: prev, toStatus: 'DORMANT', changedByName: owner, reason: 'No movement, parked', changedAt: daysAgo(Math.round(c.discAgo * 0.4)) });
  }
  return out;
}

const OUTCOMES: ActivityOutcome[] = ['CONTACTED', 'NO_RESPONSE', 'FOLLOW_UP_REQUIRED', 'REQUIREMENT_EXPECTED', 'BOQ_RECEIVED', 'NEGOTIATION'];
const ATYPES: ActivityType[] = ['CALL', 'CALL', 'EMAIL', 'NOTE'];

function activitiesFor(c: Cfg): Activity[] {
  const owner = nameOf(c.owner);
  const n = terminalWon(c) ? 5 : c.status === 'ACTIVE' ? 2 : c.status === 'DORMANT' ? 2 : 4;
  const last = c.closeAgo ?? Math.min(3, c.discAgo);
  const out: Activity[] = [];
  for (let i = 0; i < n; i++) {
    const at = Math.round(c.discAgo - ((c.discAgo - last) * i) / Math.max(1, n - 1));
    out.push({
      id: uid(),
      organizationId: org,
      prospectId: c.id,
      type: ATYPES[i % ATYPES.length],
      outcome: OUTCOMES[Math.min(i, OUTCOMES.length - 1)],
      subject: ['Intro call', 'Follow-up', 'Shared catalogue', 'Requirement discussion', 'Commercial discussion'][i % 5],
      occurredAt: daysAgo(at),
      createdByName: owner,
    });
  }
  return out;
}
const terminalWon = (c: Cfg) => c.status === 'CONVERTED';

// ---- Hand-authored ABC Tower extras --------------------------------

function abcExtras() {
  const prospectContacts: ProspectContact[] = [
    { id: 'pc-1', prospectId: 'p-abc-tower', contactId: cAmit.id, contact: cAmit, role: 'Site Engineer', isPrimary: false, notes: 'Best reached on site mornings.' },
    { id: 'pc-2', prospectId: 'p-abc-tower', contactId: cRahul.id, contact: cRahul, role: 'Purchase Manager', isPrimary: true },
    { id: 'pc-3', prospectId: 'p-abc-tower', contactId: cSuresh.id, contact: cSuresh, role: 'Decision Maker', isPrimary: false },
    { id: 'pc-4', prospectId: 'p-greenfield', contactId: cNeha.id, contact: cNeha, role: 'Architect', isPrimary: true },
  ];
  const tasks: Task[] = [
    { id: 't-1', organizationId: org, prospectId: 'p-abc-tower', prospectName: 'ABC Tower', title: 'Call Rahul after board review', type: 'FOLLOW_UP', assignedToName: actor, dueAt: daysAhead(-1), priority: 'HIGH', status: 'OPEN', createdAt: daysAgo(1) },
    { id: 't-2', organizationId: org, prospectId: 'p-abc-tower', prospectName: 'ABC Tower', title: 'Send revised estimate v2', type: 'GENERAL', assignedToName: actor, dueAt: daysAhead(2), priority: 'MEDIUM', status: 'OPEN', createdAt: daysAgo(2) },
    { id: 't-3', organizationId: org, prospectId: 'p-greenfield', prospectName: 'Greenfield Mall Expansion', title: 'Retry Neha + email catalogue', type: 'FOLLOW_UP', assignedToName: actor, dueAt: daysAhead(0), priority: 'MEDIUM', status: 'OPEN', createdAt: daysAgo(3) },
    { id: 't-4', organizationId: org, prospectId: 'p-skyline', prospectName: 'Skyline Corporate Park', title: 'Qualify budget & timeline', type: 'GENERAL', assignedToName: actor, dueAt: daysAhead(4), priority: 'LOW', status: 'OPEN', createdAt: daysAgo(4) },
    { id: 't-5', organizationId: org, prospectId: 'p-abc-tower', prospectName: 'ABC Tower', title: 'Book site visit', type: 'FOLLOW_UP', assignedToName: actor, dueAt: daysAgo(15), priority: 'HIGH', status: 'COMPLETED', completedAt: daysAgo(14), createdAt: daysAgo(19) },
    { id: 't-6', organizationId: org, prospectId: 'p-metroplaza', prospectName: 'Metro Plaza', title: 'Prepare qualification summary', type: 'GENERAL', assignedToName: nameOf('emp-priya'), dueAt: daysAhead(1), priority: 'HIGH', status: 'OPEN', createdAt: daysAgo(2) },
    { id: 't-7', organizationId: org, prospectId: 'p-summit', prospectName: 'Summit Business Bay', title: 'Second meeting with promoter', type: 'FOLLOW_UP', assignedToName: nameOf('emp-vikram'), dueAt: daysAhead(-2), priority: 'URGENT', status: 'OPEN', createdAt: daysAgo(5) },
  ];
  const meetings: Meeting[] = [
    {
      id: 'm-1', organizationId: org, prospectId: 'p-abc-tower', prospectName: 'ABC Tower',
      title: 'Technical discussion — waterproofing spec', startAt: daysAhead(3), location: 'ABC site office, Baner',
      agenda: 'Walk through estimate v1, address queries from consultant.',
      participants: [{ name: actor, kind: 'EMPLOYEE' }, { name: 'Rahul Shah', kind: 'CONTACT' }, { name: 'Suresh Kulkarni', kind: 'CONTACT' }],
      createdAt: daysAgo(1),
    },
    {
      id: 'm-2', organizationId: org, prospectId: 'p-metroplaza', prospectName: 'Metro Plaza',
      title: 'Commercial negotiation', startAt: daysAhead(5), location: 'Client HO',
      participants: [{ name: nameOf('emp-priya'), kind: 'EMPLOYEE' }],
      createdAt: daysAgo(2),
    },
  ];
  const requirementResponses: RequirementResponse[] = [
    {
      id: 'rr-1', organizationId: org, templateId: seedTemplate.id, templateName: seedTemplate.name, templateVersion: 1,
      prospectId: 'p-abc-tower', context: 'Site Visit', status: 'SUBMITTED',
      answers: {
        'q-scope': 'Basement + terrace waterproofing, box-type; crystalline admixture for raft.',
        'q-area': 145000, 'q-progress': '3rd slab', 'q-budget': 4000000, 'q-boq': true, 'q-timeline': '1–3 months',
        'q-dm': 'Suresh Kulkarni (Director)', 'q-competitors': 'Dr. Fixit, Fosroc',
        'q-visit-notes': 'Slab curing ongoing. Access from north gate. Store room available for samples.',
      },
      submittedAt: daysAgo(14), createdAt: daysAgo(14),
    },
  ];
  const siteVisits: SiteVisit[] = [
    {
      id: 'sv-1', organizationId: org, prospectId: 'p-abc-tower', prospectName: 'ABC Tower',
      visitAt: daysAgo(14), location: 'Baner, Pune', purpose: 'Initial survey + requirement capture',
      peopleMet: ['Amit Patil', 'Rahul Shah'], summary: 'Full survey done, requirement template completed, drawings collected.',
      notes: 'Positive engagement. Consultant is Spectrum.', photos: [], requirementResponseId: 'rr-1', completed: true, createdAt: daysAgo(14),
    },
  ];
  const documents: CrmDocument[] = [
    { id: 'd-1', organizationId: org, prospectId: 'p-abc-tower', fileName: 'ABC-Tower-BOQ-v1.xlsx', mimeType: 'application/vnd.ms-excel', size: 84213, relation: 'BOQ', versionNo: 1, note: 'Client-provided BOQ', uploadedByName: actor, uploadedAt: daysAgo(6) },
    { id: 'd-2', organizationId: org, prospectId: 'p-abc-tower', fileName: 'ABC-Tower-structural-drawings.pdf', mimeType: 'application/pdf', size: 2453120, relation: 'DRAWING', versionNo: 1, uploadedByName: actor, uploadedAt: daysAgo(14) },
  ];
  return { prospectContacts, tasks, meetings, requirementResponses, siteVisits, documents, contacts: [cAmit, cRahul, cSuresh, cNeha] };
}

export function buildSeed() {
  const prospects: Prospect[] = CFG.map((c) => ({
    id: c.id,
    organizationId: org,
    prospectNo: c.no,
    name: c.name,
    businessName: c.businessName,
    description:
      c.id === 'p-abc-tower'
        ? 'G+18 residential tower, waterproofing + admixtures package for the full project.'
        : `${c.location} project — construction chemicals package.`,
    projectLocation: c.location,
    ownerEmployeeId: c.owner,
    ownerName: nameOf(c.owner),
    status: c.status,
    source: c.source,
    temperature: c.temp,
    projectProgress: c.progress,
    estimatedValue: c.value,
    discoveredAt: daysAgo(c.discAgo),
    expectedDecisionDate:
      c.status === 'CONVERTED' || c.status === 'DISQUALIFIED' ? undefined : daysAhead(15 + (c.value % 30)),
    createdAt: daysAgo(c.discAgo),
    closedAt: c.closeAgo != null ? daysAgo(c.closeAgo) : undefined,
    lossReason: c.lossReason,
    convertedOpportunityId: c.status === 'CONVERTED' ? `opp-${c.id}` : undefined,
  }));

  const statusHistory = CFG.flatMap(historyFor);
  const genActivities = CFG.flatMap(activitiesFor);

  const extras = abcExtras();

  // Timeline: derive a compact feed from status history + a few key events
  const timeline: TimelineEvent[] = [
    ...statusHistory.map((h) => ({
      id: uid(),
      organizationId: org,
      prospectId: h.prospectId,
      eventType: (h.fromStatus === null ? 'ProspectCreated' : 'ProspectStatusChanged') as TimelineEvent['eventType'],
      actorName: h.changedByName,
      occurredAt: h.changedAt,
      title:
        h.fromStatus === null
          ? `Prospect ${prospects.find((p) => p.id === h.prospectId)?.name} created`
          : `${h.fromStatus} → ${h.toStatus}`,
      summary: h.reason,
    })),
    ...genActivities.slice(0, 20).map((a) => ({
      id: uid(),
      organizationId: org,
      prospectId: a.prospectId,
      eventType: 'ActivityLogged' as const,
      actorName: a.createdByName,
      occurredAt: a.occurredAt,
      title: `${a.type} — ${a.outcome.replace(/_/g, ' ').toLowerCase()}`,
      summary: a.subject,
    })),
  ].sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1));

  return {
    prospects,
    statusHistory,
    contacts: extras.contacts,
    prospectContacts: extras.prospectContacts,
    activities: genActivities,
    tasks: extras.tasks,
    meetings: extras.meetings,
    siteVisits: extras.siteVisits,
    requirementResponses: extras.requirementResponses,
    documents: extras.documents,
    timeline,
    team: seedTeam,
    targets: seedTargets,
  };
}
