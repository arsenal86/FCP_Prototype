import { Timestamp } from 'firebase/firestore';

export interface Update {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  detailedSummary: string;
  impactAssessment: string;
  publicationDate: string; // YYYY-MM-DD
  deadline?: string; // YYYY-MM-DD
  type: string;
  status: 'New & Unvalidated' | 'Validated' | 'Requires Further Review' | 'Not Applicable';
  impactedAreas: string[];
  timescales: string;
  notes: string;
  assessedBy: string; // Firebase User UID
  createdAt: Timestamp; // Firestore Timestamp
}

export interface HorizonEvent {
  id: string;
  updateId: string;
  title: string;
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
  type: string;
}
