import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Warden } from "@/types";
import apiClient from "@/lib/api";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function WardensPage() {
  const [wardens, setWardens] = useState<Warden[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; warden?: Warden }>({ open: false });

  const fetchWardens = async () => {
    try {
      const res = await apiClient.get('/college-admin/wardens');
      setWardens(res.data.data.map((w: any) => ({ ...w, id: w._id })));
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to load wardens", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchWardens();
  }, []);

  const filtered = wardens.filter(w => w.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/college-admin/wardens', form);
      toast({ title: "Warden Added", description: `${form.name} has been added` });
      setForm({ name: "", email: "", phone: "", password: "" });
      setDialogOpen(false);
      fetchWardens();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to add warden";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDialog.warden) return;
    try {
      await apiClient.delete(`/college-admin/wardens/${confirmDialog.warden.id}`);
      setWardens(prev => prev.filter(w => w.id !== confirmDialog.warden!.id));
      toast({ title: "Warden Deleted", description: `${confirmDialog.warden.name} has been deleted` });
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to delete warden", variant: "destructive" });
    }
    setConfirmDialog({ open: false });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wardens"
        description="Manage wardens for your college"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Warden</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Warden</DialogTitle>
                <DialogDescription>Enter warden details to create an account.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2"><Label>Full Name</Label><Input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Email</Label><Input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Password</Label><Input required type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} /></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Adding..." : "Add Warden"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <Card>
        <CardContent className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search wardens..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Assigned Students</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(w => (
                <TableRow key={w.id}>
                  <TableCell className="font-medium">{w.name}</TableCell>
                  <TableCell>{w.email}</TableCell>
                  <TableCell>{w.phone}</TableCell>
                  <TableCell>{w.assignedStudents}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setConfirmDialog({ open: true, warden: w })}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent >
      </Card >
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
        title="Delete Warden?"
        description={`Are you sure you want to delete ${confirmDialog.warden?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div >
  );
}
