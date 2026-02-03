export type LeadStage = 'New' | 'Contacted' | 'Tour Scheduled' | 'Offer Made' | 'Closed';

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  stage: LeadStage;
  interest: string;
  assignedTo: string;
  lastContacted: string;
  nextStep: string;
}

const leads: LeadRecord[] = [
  {
    id: 'lead-1001',
    name: 'Morgan Hill',
    email: 'morgan.hill@example.com',
    phone: '+1 (415) 555-0181',
    source: 'Zillow',
    stage: 'New',
    interest: '3BR modern condo in SoMa',
    assignedTo: 'Ava Brooks',
    lastContacted: '2025-01-02',
    nextStep: 'Send financing checklist',
  },
  {
    id: 'lead-1002',
    name: 'Diego Ramos',
    email: 'diego.ramos@example.com',
    phone: '+1 (510) 555-0138',
    source: 'Referral',
    stage: 'Contacted',
    interest: 'Single-family home in Oakland',
    assignedTo: 'Noah Patel',
    lastContacted: '2025-01-04',
    nextStep: 'Schedule property tour',
  },
  {
    id: 'lead-1003',
    name: 'Keisha Owens',
    email: 'keisha.owens@example.com',
    phone: '+1 (650) 555-0142',
    source: 'Open House',
    stage: 'Tour Scheduled',
    interest: '2BR townhouse near Palo Alto',
    assignedTo: 'Ava Brooks',
    lastContacted: '2025-01-06',
    nextStep: 'Confirm tour itinerary',
  },
  {
    id: 'lead-1004',
    name: 'Eli Thompson',
    email: 'eli.thompson@example.com',
    phone: '+1 (408) 555-0177',
    source: 'Website',
    stage: 'Offer Made',
    interest: 'Luxury penthouse downtown',
    assignedTo: 'Riley Chen',
    lastContacted: '2025-01-08',
    nextStep: 'Follow up on offer response',
  },
  {
    id: 'lead-1005',
    name: 'Sofia Alvarez',
    email: 'sofia.alvarez@example.com',
    phone: '+1 (707) 555-0155',
    source: 'Instagram',
    stage: 'Closed',
    interest: 'Vacation home in Napa',
    assignedTo: 'Noah Patel',
    lastContacted: '2025-01-10',
    nextStep: 'Send closing gift details',
  },
];

export const getLeads = () => leads;
