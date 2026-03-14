export type LeadStatus = "new" | "contacted" | "converted";
export type LeadSource = "website" | "contact_form" | "manual";

export interface LeadNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  notes: LeadNote[];
  createdAt: string;
}
