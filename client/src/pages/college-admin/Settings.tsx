import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import apiClient from "@/lib/api";

export default function SettingsPage() {
    const [enableGateSecurity, setEnableGateSecurity] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await apiClient.get('/college-admin/settings');
                if (res.data.data && res.data.data.enableGateSecurity !== undefined) {
                    setEnableGateSecurity(res.data.data.enableGateSecurity);
                }
            } catch (error) {
                console.error("Failed to load settings", error);
                toast({ title: "Error", description: "Failed to load settings", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleToggle = async (checked: boolean) => {
        const original = enableGateSecurity;
        setEnableGateSecurity(checked);
        try {
            await apiClient.put('/college-admin/settings', { enableGateSecurity: checked });
            toast({
                title: "Settings Updated",
                description: `Gate Security has been ${checked ? 'Enabled' : 'Disabled'}. ${checked ? 'Watchmen' : 'Wardens'} will handle student exits.`
            });
        } catch (error) {
            setEnableGateSecurity(original);
            toast({ title: "Error", description: "Failed to update settings", variant: "destructive" });
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <PageHeader title="Settings" description="Configure college-wide settings" />

            <Card>
                <CardHeader>
                    <CardTitle>Gate Security Control</CardTitle>
                    <CardDescription>
                        Decide who handles student entry and exit.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                        <div className="space-y-0.5">
                            <Label className="text-base">Enable Watchman Module</Label>
                            <p className="text-sm text-muted-foreground">
                                If enabled, <strong>Watchmen</strong> will mark students as "Out" and "Returned".
                                <br />
                                If disabled, <strong>Wardens</strong> will perform these actions.
                            </p>
                        </div>
                        <Switch
                            checked={enableGateSecurity}
                            onCheckedChange={handleToggle}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
