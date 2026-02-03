import { NextResponse } from 'next/server';
import { getLeads } from '@/lib/crm/leads';
import { getOutreachLog } from '@/lib/crm/outreach';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  return NextResponse.json({
    leads: getLeads(),
    outreach: getOutreachLog(),
  });
};
