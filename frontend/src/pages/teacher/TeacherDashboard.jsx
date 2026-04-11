import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, CalendarCheck, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function TeacherDashboard() {
    const { user } = useAuth();
    const token = user?.token;
    
    const [stats, setStats] = useState([
        { label: "My Classes", value: 0, icon: BookOpen },
        { label: "Total Students", value: 0, icon: Users },
        { label: "Present Today", value: 0, icon: CalendarCheck },
        { label: "Attendance Rate", value: "0%", icon: TrendingUp },
    ]);
    const [myClasses, setMyClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch classes
                const classesRes = await fetch("/api/classes", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!classesRes.ok) throw new Error("Failed to fetch classes");
                const classesData = await classesRes.json();
                setMyClasses(classesData);

                // Fetch attendance for the first class for 'today' stats (simplified for demo)
                let presentTodayCount = 0;
                let totalStudentIds = new Set();
                classesData.forEach(c => c.studentIds.forEach(id => totalStudentIds.add(id)));

                if (classesData.length > 0) {
                    const today = new Date().toISOString().split('T')[0];
                    // We'd ideally fetch overall stats, but for now we aggregate
                }

                setStats([
                    { label: "My Classes", value: classesData.length, icon: BookOpen },
                    { label: "Total Students", value: totalStudentIds.size, icon: Users },
                    { label: "Present Today", value: "-", icon: CalendarCheck },
                    { label: "Recent Performance", value: "Active", icon: TrendingUp },
                ]);
            } catch (error) {
                toast.error("Error loading dashboard data");
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchDashboardData();
    }, [token]);

    if (loading) return <div className="py-8 text-center text-muted-foreground">Loading dashboard...</div>;

    return (<div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's your teaching overview for today</p>
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
          <CardTitle className="text-base">My Assigned Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myClasses.length === 0 ? (
                <p className="py-4 text-center text-muted-foreground italic">No classes assigned yet.</p>
            ) : myClasses.map((c) => (<div key={c.classId} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                    <BookOpen className="w-4 h-4 text-accent"/>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.name} — {c.subject}</p>
                    <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{c.classId} · {c.studentIds.length} students · Section {c.section}</p>
                  </div>
                </div>
              </div>))}
          </div>
        </CardContent>
      </Card>
    </div>);
}
