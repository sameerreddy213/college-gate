import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCcw, GraduationCap, ClipboardList, LogOut, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/api";
import type { OutingRequest } from "@/types";

interface WardenStats {
  assignedStudents: number;
  pendingRequests: number;
  studentsOut: number;
  totalRequests: number;
  recentRequests: OutingRequest[];
}

export default function WardenDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<WardenStats>({
    assignedStudents: 0,
    pendingRequests: 0,
    studentsOut: 0,
    totalRequests: 0,
    recentRequests: []
  });

  const fetchStats = async () => {
    try {
      const res = await apiClient.get('/warden/dashboard');
      const data = res.data.data;
      if (data.recentRequests) {
        data.recentRequests = data.recentRequests.map((r: any) => ({ ...r, id: r._id }));
      }
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15000); // Poll every 15 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warden Dashboard"
        description="Overview"
        action={
          <Button variant="outline" size="sm" onClick={fetchStats}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Assigned Students" value={stats.assignedStudents} icon={GraduationCap} />
        <StatCard title="Pending Approvals" value={stats.pendingRequests} change="Needs action" changeType="negative" icon={Clock} />
        <StatCard title="Students Out" value={stats.studentsOut} icon={LogOut} />
        <StatCard title="Total Requests" value={stats.totalRequests} icon={ClipboardList} />
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Requests</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/warden/requests')}>
            View All
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Out Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentRequests.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.studentName}</TableCell>
                  <TableCell>{r.studentRoll}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{r.purpose}</TableCell>
                  <TableCell>{new Date(r.outDate).toLocaleDateString()}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
