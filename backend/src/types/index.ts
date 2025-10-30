export interface User {
  id: string;
  companyId?: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'manager' | 'rep';
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  locale: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  billingContact?: any;
  createdAt: Date;
  updatedAt: Date;
}

export type ProspectType = 'hotel' | 'restaurant' | 'traiteur' | 'ecole' | 'hopital' | 'autre';
export type ProspectStatus = 'to_visit' | 'in_progress' | 'converted' | 'lost';

export interface Prospect {
  id: string;
  companyId?: string;
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
  googlePlaceId?: string;
  source?: any;
  aiEnrichedAt?: Date;
  aiScore?: number;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Visit {
  id: string;
  prospectId: string;
  userId?: string;
  tourId?: string;
  visitedAt: Date;
  durationMinutes?: number;
  objective?: string;
  summary?: string;
  score?: number;
  signedBy?: string;
  signatureData?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TourStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export interface Tour {
  id: string;
  userId: string;
  companyId?: string;
  name?: string;
  date: Date;
  status: TourStatus;
  totalDistanceKm?: number;
  totalDurationMinutes?: number;
  routeData?: any;
  createdAt: Date;
  updatedAt: Date;
}

export type TourStepStatus = 'pending' | 'done' | 'skipped';

export interface TourStep {
  id: string;
  tourId: string;
  prospectId: string;
  stepOrder: number;
  eta?: Date;
  distanceFromPreviousKm?: number;
  durationFromPreviousMinutes?: number;
  status: TourStepStatus;
  completedAt?: Date;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  ownerType: 'visit' | 'prospect';
  ownerId: string;
  url: string;
  filename: string;
  mimeType?: string;
  sizeBytes?: number;
  uploadedBy?: string;
  createdAt: Date;
}

export interface Note {
  id: string;
  prospectId: string;
  userId?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  userId?: string;
  entityType?: string;
  entityId?: string;
  action: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}



