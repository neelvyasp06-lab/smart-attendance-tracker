import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, BookOpen, TrendingUp, Clock } from "lucide-react";
import { toast } from "sonner";

export default function StudentDashboard() {
    const { user } = useAuth();
    const token = user?.token;
    const userId = user?.userId;

    const [myRecords, setMyRecords] = useState([]);
    const [myClasses, setMyClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                // Fetch student records
                const recordsRes = await fetch(`/api/attendance/student/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const recordsData = await recordsRes.json();
                setMyRecords(recordsData);

                // Fetch classes
                const classesRes = await fetch("/api/classes", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const classesData = await classesRes.json();
                // Filter classes where this student is enrolled
                setMyClasses(classesData.filter(c => c.studentIds.includes(userId)));
            } catch (error) {
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        if (token && userId) fetchStudentData();
    }, [token, userId]);

    const present = myRecords.filter((r) => r.status === "present").length;
    const total = myRecords.length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    const stats = [
        { label: "My Classes", value: myClasses.length, icon: BookOpen },
        { label: "Days Present", value: present, icon: CalendarCheck },
        { label: "Total Recorded", value: total, icon: Clock },
        { label: "Attendance Rate", value: `${rate}%`, icon: TrendingUp },
    ];

    if (loading) return <div className="py-8 text-center text-muted-foreground">Loading dashboard...</div>;

    return (<div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground text-sm mt-1">Your attendance summary at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (<Card key={s.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <s.icon className="w-5 h-5 text-primary"/>
                </div>
              </div>
            </CardContent>
          </Card>))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">My Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myClasses.length === 0 ? (
                <p className="py-4 text-center text-muted-foreground italic">No classes found.</p>
            ) : myClasses.map((c) => {
                const subRecords = myRecords.filter((r) => r.classId === c.classId);
                const subPresent = subRecords.filter((r) => r.status === "present").length;
                const subTotal = subRecords.length;
                const subRate = subTotal > 0 ? Math.round((subPresent / subTotal) * 100) : 0;
                return (<div key={c.classId} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                          <BookOpen className="w-4 h-4 text-accent"/>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{c.subject}</p>
                          <p className="text-xs text-muted-foreground">{c.name} · Section {c.section}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{subRate}%</p>
                        <p className="text-xs text-muted-foreground">{subPresent}/{subTotal} days</p>
                      </div>
                    </div>);
            })}
          </div>
        </CardContent>
      </Card>
    </div>);
}
