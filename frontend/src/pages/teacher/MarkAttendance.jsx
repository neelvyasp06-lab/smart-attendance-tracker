import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, Clock, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function MarkAttendance() {
    const { user } = useAuth();
    const token = user?.token;

    const [myClasses, setMyClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [currentClass, setCurrentClass] = useState(null);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await fetch("/api/classes", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setMyClasses(data);
                if (data.length > 0) {
                    setSelectedClassId(data[0].classId);
                }
            } catch (error) {
                toast.error("Failed to load classes");
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchClasses();
    }, [token]);

    useEffect(() => {
        const fetchClassDetails = async () => {
            if (!selectedClassId) return;
            try {
                const res = await fetch(`/api/classes/${selectedClassId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setCurrentClass(data);
                    
                    // Initialize attendance statuses
                    const init = {};
                    (data.students || []).forEach(s => {
                        init[s.userId] = "present";
                    });
                    setAttendance(init);
                }
            } catch (error) {
                toast.error("Failed to load class members");
            }
        };
        if (token && selectedClassId) fetchClassDetails();
    }, [token, selectedClassId]);

    const toggleStatus = (studentUserId) => {
        setAttendance((prev) => {
            const order = ["present", "absent", "late"];
            const current = prev[studentUserId] ?? "present";
            const next = order[(order.indexOf(current) + 1) % order.length];
            return { ...prev, [studentUserId]: next };
        });
    };

    const handleSave = async () => {
        if (!currentClass) return;
        setSaving(true);
        try {
            const studentsToMark = Object.entries(attendance).map(([userId, status]) => ({
                userId,
                status
            }));

            const res = await fetch("/api/attendance/bulk-mark", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    students: studentsToMark,
                    date: new Date().toISOString().split('T')[0],
                    classId: currentClass.classId,
                    subject: currentClass.subject
                })
            });

            if (res.ok) {
                toast.success(`Attendance saved for ${currentClass.name}`);
            } else {
                toast.error("Failed to save attendance");
            }
        } catch (error) {
            toast.error("Error saving attendance");
        } finally {
            setSaving(false);
        }
    };

    const statusConfig = {
        present: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
        absent: { icon: XCircle, color: "text-destructive", bg: "bg-red-50 dark:bg-red-950/30" },
        late: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-950/30" },
    };

    if (loading) return <div className="py-8 text-center text-muted-foreground">Loading information...</div>;

    return (<div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mark Attendance</h1>
          <p className="text-muted-foreground text-sm mt-1">Today — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
        <Select value={selectedClassId} onValueChange={setSelectedClassId}>
          <SelectTrigger className="w-[220px]">
             <SelectValue placeholder="Select class"/>
          </SelectTrigger>
          <SelectContent>
            {myClasses.map((c) => (<SelectItem key={c.classId} value={c.classId}>{c.name} — {c.subject}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            {!currentClass || !currentClass.students || currentClass.students.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">No students found in this class</div>
            ) : currentClass.students.map((s) => {
                const status = attendance[s.userId] ?? "present";
                const cfg = statusConfig[status];
                const Icon = cfg.icon;
                return (<button key={s.userId} onClick={() => toggleStatus(s.userId)} className={`w-full flex items-center justify-between p-3 rounded-xl border border-border transition-all hover:shadow-sm active:scale-[0.99] ${cfg.bg}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold border border-border">
                          {(s.name || "U").split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.department}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 text-sm font-medium ${cfg.color}`}>
                        <Icon className="w-4 h-4"/>
                        <span className="capitalize">{status}</span>
                      </div>
                    </button>);
            })}
          </div>

          <Button onClick={handleSave} disabled={saving || !currentClass} className="w-full mt-4 gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
             Save Attendance
          </Button>
        </CardContent>
      </Card>
    </div>);
}
