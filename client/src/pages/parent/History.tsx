import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import apiClient from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import type { OutingRequest } from "@/types";

export default function ParentHistoryPage() {
  const [history, setHistory] = useState<OutingRequest[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await apiClient.get('/parent/history');
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
      <PageHeader title="Outing History" description="Past outing decisions for your child" />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Out Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((r, index) => (
                <TableRow key={r.id || index}>
                  <TableCell className="font-medium">{r.studentName}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{r.purpose}</TableCell>
                  <TableCell>{format(new Date(r.outDate), "PPP p")}</TableCell>
                  <TableCell>{r.returnedAt ? format(new Date(r.returnedAt), "PPP p") : "-"}</TableCell>
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
