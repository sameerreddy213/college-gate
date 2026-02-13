import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import apiClient from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import type { College } from "@/types";

export default function AddAdminPage() {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<College[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", collegeId: "", password: "" });

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await apiClient.get('/dev-admin/colleges');
        setColleges(res.data.data);
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to load colleges", variant: "destructive" });
      }
    };
    fetchColleges();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/dev-admin/create-admin', form);
      toast({ title: "Admin Added", description: `${form.name} has been assigned as college admin` });
      navigate("/dev-admin/colleges");
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to add admin", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add College Admin" description="Assign an admin to a college" />
      <Card className="max-w-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Dr. Priya Sharma" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="admin@college.edu" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="9876543210" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input required type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="******" />
            </div>
            <div className="space-y-2">
              <Label>Assign to College</Label>
              <Select value={form.collegeId} onValueChange={v => setForm(p => ({ ...p, collegeId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select college" /></SelectTrigger>
                <SelectContent>
                  {colleges.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Add Admin</Button>
              <Button type="button" variant="outline" onClick={() => navigate("/dev-admin/colleges")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
