import React, { createContext, useContext, useState, useCallback } from "react";
import { Lead, LeadNote, LeadStatus, LeadSource } from "@/types/lead";

const SEED_LEADS: Lead[] = [
  { id: "1", name: "Sarah Chen", email: "sarah@techcorp.com", phone: "+1 555-0101", source: "website", status: "new", notes: [], createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "2", name: "James Wilson", email: "j.wilson@startup.io", phone: "+1 555-0102", source: "contact_form", status: "contacted", notes: [{ id: "n1", text: "Interested in enterprise plan. Follow up next week.", createdAt: new Date(Date.now() - 86400000).toISOString() }], createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "3", name: "Maria Garcia", email: "maria@designlab.co", phone: "+1 555-0103", source: "manual", status: "converted", notes: [{ id: "n2", text: "Signed annual contract.", createdAt: new Date(Date.now() - 3600000).toISOString() }], createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: "4", name: "Alex Kumar", email: "alex.k@bigfirm.com", phone: "+1 555-0104", source: "website", status: "new", notes: [], createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "5", name: "Emily Ross", email: "emily@agency.net", phone: "+1 555-0105", source: "contact_form", status: "contacted", notes: [{ id: "n3", text: "Requested demo for team of 20.", createdAt: new Date(Date.now() - 7200000).toISOString() }], createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: "6", name: "David Park", email: "dpark@venture.com", phone: "+1 555-0106", source: "website", status: "new", notes: [], createdAt: new Date(Date.now() - 3600000 * 6).toISOString() },
];

interface LeadsContextType {
  leads: Lead[];
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "notes">) => void;
  updateStatus: (id: string, status: LeadStatus) => void;
  addNote: (id: string, text: string) => void;
  deleteLead: (id: string) => void;
}

const LeadsContext = createContext<LeadsContextType | null>(null);

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(SEED_LEADS);

  const addLead = useCallback((data: Omit<Lead, "id" | "createdAt" | "notes">) => {
    setLeads((prev) => [
      { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString(), notes: [] },
      ...prev,
    ]);
  }, []);

  const updateStatus = useCallback((id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }, []);

  const addNote = useCallback((id: string, text: string) => {
    const note: LeadNote = { id: crypto.randomUUID(), text, createdAt: new Date().toISOString() };
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notes: [note, ...l.notes] } : l)));
  }, []);

  const deleteLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return (
    <LeadsContext.Provider value={{ leads, addLead, updateStatus, addNote, deleteLead }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error("useLeads must be within LeadsProvider");
  return ctx;
}
