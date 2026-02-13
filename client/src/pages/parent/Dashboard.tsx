import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { StatCard } from "@/components/StatCard";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ClipboardList, Clock, History, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import apiClient from "@/lib/api";
import { format } from "date-fns";
import type { OutingRequest } from "@/types";

export default function ParentDashboard() {
  const [requests, setRequests] = useState<OutingRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<OutingRequest[]>([]);
  const [history, setHistory] = useState<OutingRequest[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; request?: OutingRequest; action?: string }>({ open: false });

  const fetchData = async () => {
    try {
      const [dashboardRes, historyRes] = await Promise.all([
        apiClient.get('/parent/dashboard'),
        apiClient.get('/parent/history')
      ]);

      const mapId = (items: any[]) => items.map(item => ({ ...item, id: item._id }));

      setPendingRequests(mapId(dashboardRes.data.data.pendingRequests));
      setHistory(mapId(historyRes.data.data));
      setRequests([...mapId(dashboardRes.data.data.pendingRequests), ...mapId(historyRes.data.data)]);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to load dashboard", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirm = async () => {
    if (!confirmDialog.request || !confirmDialog.action) {
      console.error("ConfirmDialog missing request or action", confirmDialog);
      return;
    }
    const { id } = confirmDialog.request;
    console.log("Processing request:", id, "Action:", confirmDialog.action);
    const action = confirmDialog.action;
    const status = action === "accept" ? "parent-approved" : "parent-declined";

    try {
      await apiClient.put(`/parent/requests/${id}`, { status });
      toast({
        title: action === "accept" ? "Approved" : "Declined",
        description: `Request has been ${action === "accept" ? "approved" : "declined"}`
      });
      fetchData();
      setConfirmDialog({ open: false });
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Action failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Parent Dashboard" description="Overview" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Pending Approval" value={pendingRequests.length} change={pendingRequests.length > 0 ? "Action needed" : ""} changeType="negative" icon={Clock} />
        <StatCard title="Total Requests" value={requests.length} icon={ClipboardList} />
        <StatCard title="Completed" value={history.filter(r => ["returned", "expired", "rejected", "parent-declined"].includes(r.status)).length} icon={History} />
      </div>

      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Clock className="h-5 w-5" /> Pending Approval</h2>
          {pendingRequests.map(r => (
            <Card key={r.id} className="overflow-hidden border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{r.studentName}</h3>
                      </div>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Purpose</Label>
                      <p className="text-sm font-medium">{r.purpose}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Destination</Label>
                      <p className="text-sm font-medium flex items-center gap-1">📍 {r.destination}</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 border-t pt-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Outward Journey</p>
                        <p className="text-sm font-semibold">{format(new Date(r.outAt || r.outDate), "PPP p")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                        <History className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Return Journey</p>
                        <p className="text-sm font-semibold">{(r.returnedAt || r.returnDate) ? format(new Date(r.returnedAt || r.returnDate), "PPP p") : "Not specified"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-2 pt-2 border-t border-dashed">
                    <Button variant="outline" onClick={() => setConfirmDialog({ open: true, request: r, action: "decline" })}>Decline</Button>
                    <Button onClick={() => setConfirmDialog({ open: true, request: r, action: "accept" })}>Approve Request</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><History className="h-5 w-5" /> Recent Activity</h2>
        {history.slice(0, 5).map(r => (
          <Card key={r.id} className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{r.studentName}</p>
                    <p className="text-sm text-muted-foreground">{r.purpose}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Out: {format(new Date(r.outAt || r.outDate), "PP p")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <History className="h-3 w-3" />
                    <span>Return: {(r.returnedAt || r.returnDate) ? format(new Date(r.returnedAt || r.returnDate), "PP p") : "-"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {history.length === 0 && <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">No recent activity</div>}
      </div>

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
        title={confirmDialog.action === "accept" ? "Approve Outing?" : "Decline Outing?"}
        description={`Are you sure you want to ${confirmDialog.action} this outing request for ${confirmDialog.request?.studentName}?`}
        confirmLabel={confirmDialog.action === "accept" ? "Approve" : "Decline"}
        variant={confirmDialog.action === "decline" ? "destructive" : "default"}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
