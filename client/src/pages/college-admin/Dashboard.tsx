import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GraduationCap, Shield, ClipboardList, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import apiClient from "@/lib/api";
import type { OutingRequest } from "@/types";

const weeklyData = [
  { day: "Mon", requests: 5 }, { day: "Tue", requests: 8 }, { day: "Wed", requests: 3 },
  { day: "Thu", requests: 12 }, { day: "Fri", requests: 15 }, { day: "Sat", requests: 7 }, { day: "Sun", requests: 2 },
];

interface DashboardStats {
  students: number;
  wardens: number;
  pendingRequests: number;
  approvedToday: number;
  recentRequests: OutingRequest[];
}

export default function CollegeAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    students: 0,
    wardens: 0,
    pendingRequests: 0,
    approvedToday: 0,
    recentRequests: []
  });

  const fetchStats = async () => {
    try {
      const res = await apiClient.get('/college-admin/dashboard');
      setStats(res.data.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="College Dashboard"
        description="Overview"
        action={
          <Button variant="outline" size="sm" onClick={fetchStats}>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-ccw"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
              Refresh
            </div>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={stats.students} changeType="positive" icon={GraduationCap} />
        <StatCard title="Wardens" value={stats.wardens} icon={Shield} />
        <StatCard title="Pending Requests" value={stats.pendingRequests} change="Needs attention" changeType="negative" icon={ClipboardList} />
        <StatCard title="Approved Today" value={stats.approvedToday} icon={CheckCircle} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Weekly Requests</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="requests" fill="hsl(239, 84%, 67%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent Requests</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentRequests.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.studentName}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{r.purpose}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
