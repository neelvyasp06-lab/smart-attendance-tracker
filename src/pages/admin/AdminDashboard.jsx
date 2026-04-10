import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { weeklyAttendance, departmentAttendance, recentActivity } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, TrendingUp, Clock } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export default function AdminDashboard() {
    const { user } = useAuth();
    const token = user?.token;

    const [stats, setStats] = useState([
        { label: "Total Users", value: 0, icon: Users, change: "Loading..." },
        { label: "Teachers", value: 0, icon: UserCheck, change: "Loading..." },
        { label: "Students", value: 0, icon: UserX, change: "Loading..." },
        { label: "Avg Attendance", value: "91%", icon: TrendingUp, change: "Overall rate" },
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/auth/users", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    const total = data.length;
                    const teachers = data.filter(u => u.role === "teacher").length;
                    const students = data.filter(u => u.role === "student").length;
                    
                    setStats([
                        { label: "Total Users", value: total, icon: Users, change: "System wide" },
                        { label: "Teachers", value: teachers, icon: UserCheck, change: "Active faculty" },
                        { label: "Students", value: students, icon: UserX, change: "Enrolled" },
                        { label: "Avg Attendance", value: "91%", icon: TrendingUp, change: "Overall rate" },
                    ]);
                }
            } catch (error) {
                toast.error("Failed to load dashboard stats");
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchStats();
    }, [token]);

    return (<div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your school management system</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (<Card key={s.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold mt-1 text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold">{s.change}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <s.icon className="w-5 h-5 text-primary"/>
                </div>
              </div>
            </CardContent>
          </Card>))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Weekly Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyAttendance}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border opacity-50"/>
                  <XAxis dataKey="day" className="text-[10px] font-medium" axisLine={false} tickLine={false}/>
                  <YAxis className="text-[10px] font-medium" axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                  <Line type="monotone" dataKey="present" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }}/>
                  <Line type="monotone" dataKey="absent" stroke="hsl(var(--destructive))" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Class-wise Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentAttendance}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border opacity-50"/>
                  <XAxis dataKey="department" className="text-[10px] font-medium" axisLine={false} tickLine={false}/>
                  <YAxis className="text-[10px] font-medium" axisLine={false} tickLine={false}/>
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}/>
                  <Bar dataKey="attendance" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} barSize={24}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((a) => (<div key={a.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0 hover:bg-muted/30 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ring-4 ${a.type === "success" ? "bg-accent ring-accent/10" : a.type === "warning" ? "bg-yellow-500 ring-yellow-500/10" : "bg-primary ring-primary/10"}`}/>
                  <div>
                    <p className="text-sm font-semibold">{a.user}</p>
                    <p className="text-xs text-muted-foreground">{a.action}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <Clock className="w-3 h-3"/>
                  {a.time}
                </div>
              </div>))}
          </div>
        </CardContent>
      </Card>
    </div>);
}
