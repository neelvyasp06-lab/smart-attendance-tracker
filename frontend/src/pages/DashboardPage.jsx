import { useAuth } from "@/hooks/useAuth";
import { weeklyAttendance, departmentAttendance, recentActivity } from "@/data/mockData";
import { Users, UserCheck, UserX, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
const stats = [
    { label: "Total Users", value: "248", change: "+12%", up: true, icon: Users, color: "primary" },
    { label: "Present Today", value: "214", change: "+3%", up: true, icon: UserCheck, color: "success" },
    { label: "Absent Today", value: "27", change: "-8%", up: false, icon: UserX, color: "destructive" },
    { label: "Attendance %", value: "91.3%", change: "+2.1%", up: true, icon: TrendingUp, color: "accent" },
];
export default function DashboardPage() {
    const { userName } = useAuth();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    return (<div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="animate-fade-up">
        <h1 className="page-header">{greeting}, {userName.split(" ")[0]} 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">Here's what's happening with your attendance today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (<div key={s.label} className="stat-card opacity-0 animate-fade-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}>
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${s.color}/10`}>
                <s.icon className={`w-5 h-5 text-${s.color}`}/>
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${s.up ? "text-success" : "text-destructive"}`}>
                {s.up ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>}
                {s.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold tracking-tight">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          </div>))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl p-6 opacity-0 animate-fade-up" style={{ animationDelay: "320ms", animationFillMode: "forwards" }}>
          <h3 className="text-sm font-semibold mb-4">Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={weeklyAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))"/>
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))"/>
              <Tooltip contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "12px",
            fontSize: "12px",
        }}/>
              <Line type="monotone" dataKey="present" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }}/>
              <Line type="monotone" dataKey="late" stroke="hsl(var(--warning))" strokeWidth={2} dot={{ r: 3 }}/>
              <Line type="monotone" dataKey="absent" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 3 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel rounded-2xl p-6 opacity-0 animate-fade-up" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
          <h3 className="text-sm font-semibold mb-4">Department Attendance</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={departmentAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
              <XAxis dataKey="department" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))"/>
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" domain={[80, 100]}/>
              <Tooltip contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "12px",
            fontSize: "12px",
        }}/>
              <Bar dataKey="attendance" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-panel rounded-2xl p-6 opacity-0 animate-fade-up" style={{ animationDelay: "480ms", animationFillMode: "forwards" }}>
        <h3 className="text-sm font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((a) => (<div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${a.type === "success" ? "bg-success" : a.type === "warning" ? "bg-warning" : "bg-info"}`}/>
                <div>
                  <p className="text-sm font-medium">{a.user}</p>
                  <p className="text-xs text-muted-foreground">{a.action}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{a.time}</span>
            </div>))}
        </div>
      </div>
    </div>);
}
