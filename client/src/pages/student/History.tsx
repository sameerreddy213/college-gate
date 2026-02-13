import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import apiClient from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import type { OutingRequest } from "@/types";

export default function StudentHistoryPage() {
  const [history, setHistory] = useState<OutingRequest[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await apiClient.get('/student/history');
        setHistory(res.data.data);
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to load history", variant: "destructive" });
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Outing History" description="Your past outings" />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Purpose</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Out Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((r, index) => (
                <TableRow key={r.id || index}>
                  <TableCell className="font-medium">{r.purpose}</TableCell>
                  <TableCell>{r.destination}</TableCell>
                  <TableCell>{new Date(r.outAt || r.outDate).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}</TableCell>
                  <TableCell>{(r.returnedAt || r.returnDate) ? new Date(r.returnedAt || r.returnDate).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase() : "-"}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                </TableRow>
              ))}
              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No history found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
