import { useState } from "react";
import { departmentAttendance, weeklyAttendance } from "@/data/mockData";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
export default function ReportsPage() {
    const { toast } = useToast();
    const [dateRange, setDateRange] = useState("week");
    const [dept, setDept] = useState("all");
    const handleExport = (type) => {
        toast({ title: `${type} export started`, description: "Your report will be ready shortly." });
    };
    const summaryStats = [
        { label: "Avg. Attendance", value: "91.3%" },
        { label: "Total Working Days", value: "22" },
        { label: "Top Department", value: "Finance" },
        { label: "Most Absent Day", value: "Friday" },
    ];
    return (<div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="page-header">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Attendance analytics and exports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("PDF")} className="rounded-xl h-10 active:scale-[0.97]">
            <FileText className="w-4 h-4 mr-2"/> PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport("CSV")} className="rounded-xl h-10 active:scale-[0.97]">
            <Download className="w-4 h-4 mr-2"/> CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 animate-fade-up" style={{ animationDelay: "80ms" }}>
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm">
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
        </select>
        <select value={dept} onChange={(e) => setDept(e.target.value)} className="h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm">
          <option value="all">All Departments</option>
          {departmentAttendance.map((d) => <option key={d.department} value={d.department}>{d.department}</option>)}
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((s, i) => (<div key={s.label} className="stat-card opacity-0 animate-fade-up" style={{ animationDelay: `${160 + i * 80}ms`, animationFillMode: "forwards" }}>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl p-6 opacity-0 animate-fade-up" style={{ animationDelay: "480ms", animationFillMode: "forwards" }}>
          <h3 className="text-sm font-semibold mb-4">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={weeklyAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))"/>
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))"/>
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }}/>
              <Line type="monotone" dataKey="present" stroke="hsl(var(--primary))" strokeWidth={2}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel rounded-2xl p-6 opacity-0 animate-fade-up" style={{ animationDelay: "560ms", animationFillMode: "forwards" }}>
          <h3 className="text-sm font-semibold mb-4">By Department</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={departmentAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
              <XAxis dataKey="department" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))"/>
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" domain={[80, 100]}/>
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }}/>
              <Bar dataKey="attendance" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>);
}
