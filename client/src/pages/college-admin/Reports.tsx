import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Download } from "lucide-react";
import apiClient from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import type { OutingRequest } from "@/types";

export default function ReportsPage() {
  const [requests, setRequests] = useState<OutingRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await apiClient.get('/college-admin/requests');
        setRequests(res.data.data);
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to load reports", variant: "destructive" });
      }
    };
    fetchRequests();
  }, []);

  const handleExport = () => {
    // In a real app, this would trigger a backend CSV download or generate it client-side
    const headers = ["Student", "Roll No", "Purpose", "Out Date", "Return Date", "Status"];
    const csvContent = [
      headers.join(","),
      ...requests.map(r => [
        r.studentName,
        r.rollNumber,
        `"${r.purpose}"`,
        new Date(r.outDate).toLocaleDateString(),
        new Date(r.returnDate).toLocaleDateString(),
        r.status
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "outing_report.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    toast({ title: "Report Exported", description: "CSV file downloaded successfully" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Export outing data and generate reports"
        action={<Button onClick={handleExport}><Download className="mr-2 h-4 w-4" />Export CSV</Button>}
      />
      <Card>
        <CardHeader><CardTitle className="text-base">Outing Summary</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Roll No.</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Out Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r, index) => (
                <TableRow key={r.id || index}>
                  <TableCell className="font-medium">{r.studentName}</TableCell>
                  <TableCell>{r.rollNumber}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{r.purpose}</TableCell>
                  <TableCell>{new Date(r.outDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(r.returnDate).toLocaleDateString()}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                </TableRow>
              ))}
              {requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No data available
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
