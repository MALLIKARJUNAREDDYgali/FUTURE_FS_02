import { useLeads } from "@/context/LeadsContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserPlus, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { leads } = useLeads();

  const stats = [
    {
      title: "Total Leads",
      value: leads.length,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "New",
      value: leads.filter((l) => l.status === "new").length,
      icon: UserPlus,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      title: "Contacted",
      value: leads.filter((l) => l.status === "contacted").length,
      icon: UserCheck,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Converted",
      value: leads.filter((l) => l.status === "converted").length,
      icon: TrendingUp,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  const conversionRate = leads.length
    ? Math.round((leads.filter((l) => l.status === "converted").length / leads.length) * 100)
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your lead pipeline</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-lg p-2 ${stat.bg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <span className="text-5xl font-bold text-primary">{conversionRate}%</span>
              <span className="text-muted-foreground pb-1">of leads converted</span>
            </div>
            <div className="mt-4 h-3 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${conversionRate}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-warning/15 text-warning",
    contacted: "bg-primary/15 text-primary",
    converted: "bg-success/15 text-success",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[status] || ""}`}>
      {status}
    </span>
  );
}
