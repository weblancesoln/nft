'use client';

import { useEffect, useMemo, useState } from 'react';

interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  stage: 'New' | 'Contacted' | 'Tour Scheduled' | 'Offer Made' | 'Closed';
  interest: string;
  assignedTo: string;
  lastContacted: string;
  nextStep: string;
}

interface OutreachLog {
  id: string;
  leadId: string;
  leadName: string;
  channel: 'email' | 'message';
  subject?: string;
  message: string;
  sentBy: string;
  createdAt: string;
  status: 'queued' | 'sent';
}

export default function CrmPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [outreach, setOutreach] = useState<OutreachLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [channel, setChannel] = useState<'email' | 'message'>('email');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [agentName, setAgentName] = useState('Ava Brooks');
  const [status, setStatus] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [sending, setSending] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    const res = await fetch('/api/crm/leads');
    const data = await res.json();
    setLeads(data.leads || []);
    setOutreach(data.outreach || []);
    setSelectedLeadId((prev) => prev || data.leads?.[0]?.id || '');
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedLeadId) || null,
    [leads, selectedLeadId],
  );

  const filteredLeads = useMemo(() => {
    if (!filter) return leads;
    const query = filter.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.phone.toLowerCase().includes(query) ||
        lead.stage.toLowerCase().includes(query),
    );
  }, [filter, leads]);

  const leadStats = useMemo(() => {
    const byStage = leads.reduce<Record<string, number>>((acc, lead) => {
      acc[lead.stage] = (acc[lead.stage] || 0) + 1;
      return acc;
    }, {});
    return byStage;
  }, [leads]);

  const handleSend = async () => {
    if (!selectedLead) return;
    setSending(true);
    setStatus(null);
    const res = await fetch('/api/crm/outreach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId: selectedLead.id,
        channel,
        subject: channel === 'email' ? subject : undefined,
        message,
        sentBy: agentName,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus(data.message || 'Outreach queued.');
      setMessage('');
      setSubject('');
      fetchLeads();
    } else {
      setStatus(data.error || 'Unable to send outreach.');
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/70">
        Loading CRM workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-white">
      <div className="container py-12 space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary/80">Real Estate CRM</p>
            <h1 className="text-4xl font-bold mt-2">Leads & Outreach Center</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Manage every buyer, seller, and investor lead in one place. Deliver personalized emails
              or text messages directly from this workspace and track outreach history.
            </p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-white/10 max-w-xl">
            <p className="text-sm text-muted-foreground">Pipeline Snapshot</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 text-sm">
              {Object.entries(leadStats).map(([stage, count]) => (
                <div key={stage} className="bg-black/30 rounded-xl px-4 py-3">
                  <p className="text-muted-foreground">{stage}</p>
                  <p className="text-2xl font-semibold">{count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">All Leads</h2>
                <p className="text-sm text-muted-foreground">Click a lead to load their details.</p>
              </div>
              <input
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Search by name, stage, or email"
                className="w-full sm:w-72 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary/60"
              />
            </div>
            <div className="overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-muted-foreground border-b border-white/10">
                  <tr>
                    <th className="py-3">Lead</th>
                    <th className="py-3">Stage</th>
                    <th className="py-3">Assigned</th>
                    <th className="py-3">Last Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className={`border-b border-white/5 cursor-pointer transition-colors ${
                        selectedLeadId === lead.id ? 'bg-primary/10' : 'hover:bg-white/5'
                      }`}
                      onClick={() => setSelectedLeadId(lead.id)}
                    >
                      <td className="py-3">
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-xs text-muted-foreground">{lead.email}</div>
                      </td>
                      <td className="py-3">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{lead.stage}</span>
                      </td>
                      <td className="py-3">{lead.assignedTo}</td>
                      <td className="py-3">{lead.lastContacted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredLeads.length === 0 && (
                <p className="text-sm text-muted-foreground py-6 text-center">No leads match that filter.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-2xl font-semibold">Lead Details</h2>
              {selectedLead ? (
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Interest</p>
                    <p className="font-medium">{selectedLead.interest}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p>{selectedLead.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Source</p>
                      <p>{selectedLead.source}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Next Step</p>
                    <p>{selectedLead.nextStep}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Select a lead to view details.</p>
              )}
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Send Outreach</h2>
                <select
                  value={channel}
                  onChange={(event) => setChannel(event.target.value as 'email' | 'message')}
                  className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="email">Email</option>
                  <option value="message">Message</option>
                </select>
              </div>
              <div className="space-y-3 text-sm">
                <input
                  value={agentName}
                  onChange={(event) => setAgentName(event.target.value)}
                  placeholder="Agent name"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none"
                />
                {channel === 'email' && (
                  <input
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="Email subject"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none"
                  />
                )}
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={5}
                  placeholder="Write a personalized message..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!selectedLead || !message || (channel === 'email' && !subject) || sending}
                  className="w-full btn btn-primary disabled:opacity-50"
                >
                  {sending ? 'Sending...' : `Send ${channel === 'email' ? 'Email' : 'Message'}`}
                </button>
                {status && <p className="text-xs text-muted-foreground">{status}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Recent Outreach</h2>
            <span className="text-xs text-muted-foreground">Queued for delivery</span>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-muted-foreground border-b border-white/10">
                <tr>
                  <th className="py-3">Lead</th>
                  <th className="py-3">Channel</th>
                  <th className="py-3">Agent</th>
                  <th className="py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {outreach.map((entry) => (
                  <tr key={entry.id} className="border-b border-white/5">
                    <td className="py-3">
                      <div className="font-medium">{entry.leadName}</div>
                      <div className="text-xs text-muted-foreground">{entry.subject || entry.message}</div>
                    </td>
                    <td className="py-3 capitalize">{entry.channel}</td>
                    <td className="py-3">{entry.sentBy}</td>
                    <td className="py-3">{new Date(entry.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {outreach.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No outreach yet. Send your first email or message above.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
