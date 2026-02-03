import { NextResponse } from 'next/server';
import { getLeads } from '@/lib/crm/leads';
import { logOutreach, OutreachPayload } from '@/lib/crm/outreach';

export const dynamic = 'force-dynamic';

const isValidPayload = (payload: OutreachPayload) => {
  if (!payload.leadId || !payload.channel || !payload.message || !payload.sentBy) {
    return false;
  }
  if (payload.channel === 'email' && !payload.subject) {
    return false;
  }
  return true;
};

export const POST = async (request: Request) => {
  const body = (await request.json()) as OutreachPayload;
  if (!isValidPayload(body)) {
    return NextResponse.json({ error: 'Invalid outreach payload.' }, { status: 400 });
  }

  const lead = getLeads().find((item) => item.id === body.leadId);
  if (!lead) {
    return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
  }

  const entry = logOutreach(body, lead);

  return NextResponse.json({
    outreach: entry,
    message: 'Outreach queued for delivery. Configure SMS/email integrations to send live messages.',
  });
};
