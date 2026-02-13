import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import apiClient from "@/lib/api";
import type { OutingRequest } from "@/types";

export default function WardenHistoryPage() {
  const [history, setHistory] = useState<OutingRequest[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await apiClient.get('/warden/history');
        setHistory(res.data.data.map((r: any) => ({ ...r, id: r._id })));
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to load history", variant: "destructive" });
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="History" description="Past outing requests and approvals" />
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Out Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.studentName}</TableCell>
                  <TableCell>{r.studentRoll}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{r.purpose}</TableCell>
                  <TableCell>{new Date(r.outAt || r.outDate).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}</TableCell>
                  <TableCell>{(r.returnedAt || r.returnDate) ? new Date(r.returnedAt || r.returnDate).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase() : "-"}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                </TableRow>
              ))}
              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
