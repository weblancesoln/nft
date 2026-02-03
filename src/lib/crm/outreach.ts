import type { LeadRecord } from './leads';

export type OutreachChannel = 'email' | 'message';

export interface OutreachPayload {
  leadId: string;
  channel: OutreachChannel;
  subject?: string;
  message: string;
  sentBy: string;
}

export interface OutreachLog extends OutreachPayload {
  id: string;
  createdAt: string;
  leadName: string;
  status: 'queued' | 'sent';
}

const outreachLog: OutreachLog[] = [];

export const logOutreach = (payload: OutreachPayload, lead: LeadRecord): OutreachLog => {
  const entry: OutreachLog = {
    ...payload,
    id: `outreach-${outreachLog.length + 1}`,
    createdAt: new Date().toISOString(),
    leadName: lead.name,
    status: 'queued',
  };

  outreachLog.unshift(entry);
  return entry;
};

export const getOutreachLog = () => outreachLog;
