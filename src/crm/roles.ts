/* =========================================================================
   Dashboard personas. One demo login (Raj), but the dashboard renders a
   different management view per role — mirrors blueprint §7 employees:
   Salesperson | Marketing Head | (Sales) Manager | Director / Owner.
   ========================================================================= */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DashRole = 'SALES' | 'MARKETING' | 'MANAGER' | 'DIRECTOR';

export const ROLE_META: Record<
  DashRole,
  { label: string; who: string; icon: string; scope: 'MINE' | 'TEAM' }
> = {
  SALES: {
    label: 'Salesperson',
    who: 'My prospects, my effort, my follow-ups',
    icon: 'bi-person-badge',
    scope: 'MINE',
  },
  MARKETING: {
    label: 'Marketing Head',
    who: 'Lead generation, sources, funnel quality',
    icon: 'bi-megaphone',
    scope: 'TEAM',
  },
  MANAGER: {
    label: 'Sales Manager',
    who: 'Team performance, targets, stage bottlenecks',
    icon: 'bi-people',
    scope: 'TEAM',
  },
  DIRECTOR: {
    label: 'Director / Owner',
    who: 'Revenue, win rate, pipeline health, why we win & lose',
    icon: 'bi-buildings',
    scope: 'TEAM',
  },
};

export const ROLE_ORDER: DashRole[] = ['SALES', 'MARKETING', 'MANAGER', 'DIRECTOR'];

interface RoleState {
  role: DashRole;
  setRole: (r: DashRole) => void;
}

export const useDashRole = create<RoleState>()(
  persist((set) => ({ role: 'SALES', setRole: (role) => set({ role }) }), {
    name: 'aegis-dash-role',
  }),
);
