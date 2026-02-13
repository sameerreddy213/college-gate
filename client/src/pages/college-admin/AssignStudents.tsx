import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import apiClient from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import type { Student, User } from "@/types";

export default function AssignStudentsPage() {
  const [wardens, setWardens] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedWarden, setSelectedWarden] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      const [wardensRes, studentsRes] = await Promise.all([
        apiClient.get('/college-admin/wardens'),
        apiClient.get('/college-admin/students')
      ]);
      setWardens(wardensRes.data.data);
      setStudents(studentsRes.data.data);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleStudent = (id: string) => {
    setSelectedStudents(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleAssign = async () => {
    if (!selectedWarden || selectedStudents.length === 0) return;
    try {
      await apiClient.post('/college-admin/assign', {
        wardenId: selectedWarden,
        studentIds: selectedStudents
      });
      const wardenName = wardens.find(w => w.id === selectedWarden)?.name;
      toast({ title: "Students Assigned", description: `${selectedStudents.length} students assigned to ${wardenName}` });
      setSelectedStudents([]);
      fetchData(); // Refresh to show updated assignments
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Assignment failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Assign Students" description="Assign students to wardens" />
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="w-full sm:w-64 space-y-2">
              <label className="text-sm font-medium">Select Warden</label>
              <Select value={selectedWarden} onValueChange={setSelectedWarden}>
                <SelectTrigger><SelectValue placeholder="Choose warden" /></SelectTrigger>
                <SelectContent>
                  {wardens.map((w, index) => <SelectItem key={w.id || w._id || index} value={w.id || w._id}>{w.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAssign} disabled={!selectedWarden || selectedStudents.length === 0}>
              Assign {selectedStudents.length > 0 ? `(${selectedStudents.length})` : ""}
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Roll No.</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Current Warden</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s, index) => (
                <TableRow key={s.id || s._id || index}>
                  <TableCell>
                    <Checkbox checked={selectedStudents.includes(s.id || s._id)} onCheckedChange={() => toggleStudent(s.id || s._id)} />
                  </TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.rollNumber}</TableCell>
                  <TableCell>{s.department}</TableCell>
                  <TableCell>{(typeof s.wardenId === 'object' ? s.wardenId?.name : (s.wardenName || <span className="text-muted-foreground text-xs">Unassigned</span>))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
