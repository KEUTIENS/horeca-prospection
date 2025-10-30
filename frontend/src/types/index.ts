export interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'rep';
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  locale: string;
  isActive: boolean;
  companyId?: string;
}

export type ProspectType = 'hotel' | 'restaurant' | 'traiteur' | 'ecole' | 'hopital' | 'autre';
export type ProspectStatus = 'to_visit' | 'in_progress' | 'converted' | 'lost';

export interface Prospect {
  id: string;
  name: string;
  type?: ProspectType;
  address?: string;
  postalCode?: string;
  city?: string;
  country: string;
  phone?: string;
  email?: string;
  website?: string;
  managerName?: string;
  openingHours?: any;
  status: ProspectStatus;
  noteAvg: number;
  visitsCount: number;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Visit {
  id: string;
  prospectId: string;
  userId: string;
  visitedAt: string;
  durationMinutes?: number;
  objective?: string;
  summary?: string;
  score?: number;
  signedBy?: string;
  createdAt: string;
}

export type TourStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export interface Tour {
  id: string;
  userId: string;
  name?: string;
  date: string;
  status: TourStatus;
  totalDistanceKm?: number;
  totalDurationMinutes?: number;
  createdAt: string;
}

export interface TourStep {
  id: string;
  tourId: string;
  prospectId: string;
  prospect?: Prospect;
  stepOrder: number;
  eta?: string;
  distanceFromPreviousKm?: number;
  durationFromPreviousMinutes?: number;
  status: 'pending' | 'done' | 'skipped';
}

export interface Stats {
  totalVisits: number;
  avgScore: number;
  conversionRate: number;
  weeklyVisits: Array<{ week: string; count: number }>;
  topProspects: Array<{
    id: string;
    name: string;
    noteAvg: number;
    visitsCount: number;
  }>;
}



