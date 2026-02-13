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
import type { User } from "@/types";
import apiClient from "@/lib/api";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function WatchmenPage() {
    const [watchmen, setWatchmen] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; watchman?: User }>({ open: false });

    const fetchWatchmen = async () => {
        try {
            const res = await apiClient.get('/college-admin/watchmen');
            setWatchmen(res.data.data.map((w: any) => ({ ...w, id: w._id })));
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to load watchmen", variant: "destructive" });
        }
    };

    useEffect(() => {
        fetchWatchmen();
    }, []);

    const filtered = watchmen.filter(w => w.name.toLowerCase().includes(search.toLowerCase()));

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiClient.post('/college-admin/watchmen', form);
            toast({ title: "Watchman Added", description: `${form.name} has been added` });
            setForm({ name: "", email: "", phone: "", password: "" });
            setDialogOpen(false);
            fetchWatchmen();
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to add watchman";
            toast({ title: "Error", description: message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirmDialog.watchman) return;
        try {
            await apiClient.delete(`/college-admin/watchmen/${confirmDialog.watchman.id}`);
            setWatchmen(prev => prev.filter(w => w.id !== confirmDialog.watchman!.id));
            toast({ title: "Watchman Deleted", description: `${confirmDialog.watchman.name} has been deleted` });
        } catch (error: any) {
            toast({ title: "Error", description: error.response?.data?.message || "Failed to delete watchman", variant: "destructive" });
        }
        setConfirmDialog({ open: false });
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Watchmen"
                description="Manage security personnel (Watchmen) for your college"
                action={
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Watchman</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Watchman</DialogTitle>
                                <DialogDescription>Enter watchman details to create an account.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAdd} className="space-y-4">
                                <div className="space-y-2"><Label>Full Name</Label><Input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
                                <div className="space-y-2"><Label>Email</Label><Input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
                                <div className="space-y-2"><Label>Phone</Label><Input required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
                                <div className="space-y-2"><Label>Password</Label><Input required type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} /></div>
                                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Adding..." : "Add Watchman"}</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                }
            />
            <Card>
                <CardContent className="p-4">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search watchmen..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead className="w-10"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map(w => (
                                <TableRow key={w.id}>
                                    <TableCell className="font-medium">{w.name}</TableCell>
                                    <TableCell>{w.email}</TableCell>
                                    <TableCell>{w.phone}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setConfirmDialog({ open: true, watchman: w })}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No watchmen found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <ConfirmDialog
                open={confirmDialog.open}
                onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
                title="Delete Watchman?"
                description={`Are you sure you want to delete ${confirmDialog.watchman?.name}? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="destructive"
                onConfirm={handleDelete}
            />
        </div>
    );
}
