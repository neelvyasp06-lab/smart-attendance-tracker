import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Scan } from "lucide-react";
const roles = [
    { value: "admin", label: "Admin", desc: "Full system access" },
    { value: "teacher", label: "Teacher", desc: "Manage classes & attendance" },
    { value: "student", label: "Student", desc: "View your records" },
];
export default function LoginPage() {
    const { login } = useAuth();
    const [selectedRole, setSelectedRole] = useState("admin");
    const [email, setEmail] = useState("admin@company.com");
    const [password, setPassword] = useState("password");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await login(selectedRole, email, password);
        if (!res.success) {
            toast.error(res.message);
        }
        setLoading(false);
    };
    return (<div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-muted">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full gradient-primary opacity-10 blur-3xl"/>
        <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] rounded-full bg-accent opacity-10 blur-3xl"/>
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">N</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Attendance System</span>
          </div>
          <p className="text-muted-foreground text-sm">Smart Tracking Solution</p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-2xl p-8 shadow-xl">
          <h2 className="text-lg font-semibold mb-1">Welcome back</h2>
          <p className="text-sm text-muted-foreground mb-6">Sign in to your account</p>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map((r) => (<button key={r.value} onClick={() => setSelectedRole(r.value)} className={`rounded-xl p-3 text-center transition-all duration-200 border text-xs font-medium ${selectedRole === r.value
                ? "gradient-primary text-primary-foreground border-transparent shadow-lg"
                : "bg-secondary/50 border-border hover:bg-secondary text-foreground"}`}>
                <div className="font-semibold text-sm">{r.label}</div>
                <div className={`mt-0.5 ${selectedRole === r.value ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {r.desc}
                </div>
              </button>))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="h-11 rounded-xl bg-secondary/50" required/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input id="password" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-11 rounded-xl bg-secondary/50 pr-10" required/>
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl gradient-primary text-primary-foreground font-medium shadow-lg hover:opacity-90 transition-opacity active:scale-[0.98]">
              {loading ? (<span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"/>
                  Signing in...
                </span>) : ("Sign in")}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Demo mode — select a role and click sign in
          </p>
        </div>
      </div>
    </div>);
}
