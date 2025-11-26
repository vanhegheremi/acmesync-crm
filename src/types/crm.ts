export type LeadType = 'tryon' | 'himyt';

export type Priority = 'low' | 'medium' | 'high';

export type TryonStatus = 'cold' | 'interested' | 'demo' | 'test' | 'won' | 'lost';
export type HimytStatus = 'cold' | 'problem_detected' | 'discovery_call' | 'proposal' | 'won' | 'lost';

export type LeadStatus = TryonStatus | HimytStatus;

export type ActivityType = 'email' | 'call' | 'linkedin' | 'demo' | 'other';

export type LeadOrigin = 'cold_email' | 'cold_call' | 'newsletter' | 'linkedin' | 'recommendation' | 'website' | 'other';
export type LeadTemperature = 'hot' | 'warm' | 'cold';

export interface Lead {
  id: string;
  type: LeadType;
  company_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  segment: string | null;
  status: LeadStatus;
  notes: string | null;
  last_contact_date: string | null;
  next_action: string | null;
  next_action_date: string | null;
  priority: Priority;
  origin: LeadOrigin | null;
  temperature: LeadTemperature | null;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  lead_id: string;
  date: string;
  type: ActivityType;
  content: string;
  done_by: string | null;
  created_at: string;
}

export const TRYON_STATUSES: TryonStatus[] = ['cold', 'interested', 'demo', 'test', 'won', 'lost'];
export const HIMYT_STATUSES: HimytStatus[] = ['cold', 'problem_detected', 'discovery_call', 'proposal', 'won', 'lost'];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  cold: 'Cold',
  interested: 'Intéressé',
  demo: 'Démo',
  test: 'Test en cours',
  problem_detected: 'Problème détecté',
  discovery_call: 'Discovery Call',
  proposal: 'Proposition',
  won: 'Gagné',
  lost: 'Perdu',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
};

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  email: 'Email',
  call: 'Appel',
  linkedin: 'LinkedIn',
  demo: 'Démo',
  other: 'Autre',
};

export const ORIGIN_LABELS: Record<LeadOrigin, string> = {
  cold_email: 'Cold email',
  cold_call: 'Cold call',
  newsletter: 'Ouverture newsletter',
  linkedin: 'LinkedIn',
  recommendation: 'Recommandation',
  website: 'Site web',
  other: 'Autre',
};

export const TEMPERATURE_LABELS: Record<LeadTemperature, string> = {
  hot: 'Chaud',
  warm: 'Tiède',
  cold: 'Froid',
};
