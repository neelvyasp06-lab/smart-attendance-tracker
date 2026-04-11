import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
export default function SettingsPage() {
    const { userName, role } = useAuth();
    const { toast } = useToast();
    const [name, setName] = useState(userName);
    const [email, setEmail] = useState("admin@company.com");
    const [permissions, setPermissions] = useState({
        manageUsers: true,
        viewReports: true,
        markAttendance: true,
        aiModule: true,
        exportData: role === "admin",
        systemSettings: role === "admin",
    });
    const [prefs, setPrefs] = useState({
        emailNotifs: true,
        pushNotifs: false,
        weeklyDigest: true,
        autoLock: true,
    });
    const handleSave = () => {
        toast({ title: "Settings saved", description: "Your preferences have been updated." });
    };
    return (<div className="space-y-6 max-w-3xl">
      <div className="animate-fade-up">
        <h1 className="page-header">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile and preferences</p>
      </div>

      {/* Profile */}
      <div className="glass-panel rounded-2xl p-6 space-y-4 animate-fade-up" style={{ animationDelay: "80ms" }}>
        <h3 className="text-sm font-semibold">Profile</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
            {userName.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="font-semibold">{userName}</p>
            <p className="text-sm text-muted-foreground capitalize">{role}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <Label className="text-sm">Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-10 rounded-xl bg-secondary/50"/>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 rounded-xl bg-secondary/50"/>
          </div>
        </div>
      </div>

      {/* Role permissions */}
      <div className="glass-panel rounded-2xl p-6 space-y-4 animate-fade-up" style={{ animationDelay: "160ms" }}>
        <h3 className="text-sm font-semibold">Role Permissions</h3>
        <div className="space-y-3">
          {Object.entries(permissions).map(([key, val]) => (<div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium">{key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</p>
                <p className="text-xs text-muted-foreground">
                  {val ? "Enabled for your role" : "Restricted"}
                </p>
              </div>
              <Switch checked={val} onCheckedChange={(v) => setPermissions((p) => ({ ...p, [key]: v }))}/>
            </div>))}
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-panel rounded-2xl p-6 space-y-4 animate-fade-up" style={{ animationDelay: "240ms" }}>
        <h3 className="text-sm font-semibold">Notifications & Preferences</h3>
        <div className="space-y-3">
          {Object.entries(prefs).map(([key, val]) => (<div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <p className="text-sm font-medium">{key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</p>
              <Switch checked={val} onCheckedChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))}/>
            </div>))}
        </div>
      </div>

      <Button onClick={handleSave} className="gradient-primary text-primary-foreground rounded-xl h-11 px-8 active:scale-[0.97] transition-transform">
        Save Changes
      </Button>
    </div>);
}
