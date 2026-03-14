import { useState } from "react";
import { useLeads } from "@/context/LeadsContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Lead, LeadStatus, LeadSource } from "@/types/lead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2, MessageSquarePlus, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-warning/15 text-warning border-warning/20",
  contacted: "bg-primary/15 text-primary border-primary/20",
  converted: "bg-success/15 text-success border-success/20",
};

export default function LeadsPage() {
  const { leads, addLead, updateStatus, addNote, deleteLead } = useLeads();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [noteText, setNoteText] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [newLead, setNewLead] = useState({
    name: "", email: "", phone: "", source: "manual" as LeadSource, status: "new" as LeadStatus,
  });

  const filtered = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddLead = () => {
    if (!newLead.name || !newLead.email) return;
    addLead(newLead);
    setNewLead({ name: "", email: "", phone: "", source: "manual", status: "new" });
    setShowAddDialog(false);
  };

  const handleAddNote = () => {
    if (!noteText.trim() || !selectedLead) return;
    addNote(selectedLead.id, noteText.trim());
    setNoteText("");
    // refresh selected lead
    setSelectedLead((prev) => {
      if (!prev) return null;
      const updated = leads.find((l) => l.id === prev.id);
      return updated || prev;
    });
  };

  // Keep selectedLead in sync
  const activeLead = selectedLead ? leads.find((l) => l.id === selectedLead.id) || selectedLead : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
            <p className="text-muted-foreground">{filtered.length} lead{filtered.length !== 1 ? "s" : ""}</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Lead
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Two-column layout: table + detail */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Table */}
          <motion.div
            className={`${activeLead ? "lg:w-3/5" : "w-full"} transition-all`}
            layout
          >
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden sm:table-cell">Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                        No leads found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((lead) => (
                      <TableRow
                        key={lead.id}
                        className={`cursor-pointer transition-colors ${activeLead?.id === lead.id ? "bg-primary/5" : "hover:bg-muted/30"}`}
                        onClick={() => setSelectedLead(lead)}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-xs text-muted-foreground md:hidden">{lead.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{lead.email}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="capitalize text-sm text-muted-foreground">{lead.source.replace("_", " ")}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`capitalize ${STATUS_COLORS[lead.status]}`}>
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive/60 hover:text-destructive"
                              onClick={(e) => { e.stopPropagation(); setDeleteId(lead.id); }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>

          {/* Detail panel */}
          {activeLead && (
            <motion.div
              className="lg:w-2/5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="rounded-xl border border-border bg-card p-6 sticky top-20 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">{activeLead.name}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedLead(null)}>
                    Close
                  </Button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span>{activeLead.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span>{activeLead.phone || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source</span>
                    <span className="capitalize">{activeLead.source.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <Select
                      value={activeLead.status}
                      onValueChange={(v) => updateStatus(activeLead.id, v as LeadStatus)}
                    >
                      <SelectTrigger className="w-36 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>{new Date(activeLead.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MessageSquarePlus className="h-4 w-4" /> Notes
                  </h3>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a follow-up note…"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                  <Button size="sm" onClick={handleAddNote} disabled={!noteText.trim()}>
                    Add Note
                  </Button>

                  {activeLead.notes.length > 0 && (
                    <div className="space-y-2 max-h-60 overflow-auto">
                      {activeLead.notes.map((note) => (
                        <div key={note.id} className="rounded-lg bg-muted p-3 text-sm">
                          <p>{note.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(note.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Add Lead Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>Enter the lead's contact information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Source</Label>
              <Select value={newLead.source} onValueChange={(v) => setNewLead({ ...newLead, source: v as LeadSource })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="contact_form">Contact Form</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddLead} disabled={!newLead.name || !newLead.email}>Add Lead</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (deleteId) { deleteLead(deleteId); if (activeLead?.id === deleteId) setSelectedLead(null); setDeleteId(null); } }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
