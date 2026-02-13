import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { StatusTimeline } from "@/components/StatusTimeline";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import type { OutingRequest } from "@/types";

export default function MyRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<OutingRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await apiClient.get('/student/requests');
        setRequests(res.data.data);
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to load requests", variant: "destructive" });
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Requests"
        description="Track all your outing requests"
        action={<Button onClick={() => navigate("/student/raise-request")}>New Request</Button>}
      />
      <div className="space-y-4">
        {requests.map((r, index) => (
          <Card key={r.id || index}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{r.purpose}</p>
                  <p className="text-sm text-muted-foreground">{r.destination}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Out: {new Date(r.outAt || r.outDate).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}</span>
                <span>Return: {(r.returnedAt || r.returnDate) ? new Date(r.returnedAt || r.returnDate).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase() : "Not returned yet"}</span>
              </div>
              <StatusTimeline status={r.status} />
            </CardContent>
          </Card>
        ))}
        {requests.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No requests found</p>
        )}
      </div>
    </div>
  );
}
