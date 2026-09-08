/* Session/tenant context for the CRM mock layer. When the real API lands,
   these come from the auth session + selected workspace instead. */

export const CURRENT_ORG_ID = 'org-abc-construction';
export const CURRENT_USER = { employeeId: 'emp-raj', name: 'Raj Malhotra' };

export const uid = () =>
  (globalThis.crypto?.randomUUID?.() ??
    `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);

export const nowIso = () => new Date().toISOString();
