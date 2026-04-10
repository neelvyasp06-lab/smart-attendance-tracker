import { useState } from "react";
import { users } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, X, Clock } from "lucide-react";
export default function AttendancePage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [attendance, setAttendance] = useState(() => {
        const init = {};
        users.forEach((u) => { init[u.id] = Math.random() > 0.15 ? "present" : Math.random() > 0.5 ? "absent" : "late"; });
        return init;
    });
    const [selected, setSelected] = useState(new Set());
    const toggleStatus = (userId) => {
        setAttendance((prev) => {
            const order = ["present", "absent", "late"];
            const idx = order.indexOf(prev[userId]);
            return { ...prev, [userId]: order[(idx + 1) % 3] };
        });
    };
    const toggleSelect = (id) => {
        setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    };
    const bulkMark = (status) => {
        setAttendance((prev) => {
            const next = { ...prev };
            selected.forEach((id) => { next[id] = status; });
            return next;
        });
        setSelected(new Set());
    };
    const statusIcon = (s) => {
        if (s === "present")
            return <Check className="w-3.5 h-3.5"/>;
        if (s === "absent")
            return <X className="w-3.5 h-3.5"/>;
        return <Clock className="w-3.5 h-3.5"/>;
    };
    const statusColor = (s) => {
        if (s === "present")
            return "bg-success/10 text-success border-success/20";
        if (s === "absent")
            return "bg-destructive/10 text-destructive border-destructive/20";
        return "bg-warning/10 text-warning border-warning/20";
    };
    // Calendar
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const today = new Date();
    const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });
    return (<div className="space-y-6 max-w-7xl">
      <div className="animate-fade-up">
        <h1 className="page-header">Attendance</h1>
        <p className="text-sm text-muted-foreground mt-1">Mark and manage daily attendance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mark Attendance */}
        <div className="lg:col-span-2 space-y-4">
          {selected.size > 0 && (<div className="glass-panel rounded-xl p-3 flex items-center gap-3 animate-fade-up">
              <span className="text-sm font-medium">{selected.size} selected</span>
              <div className="flex gap-2 ml-auto">
                <Button size="sm" onClick={() => bulkMark("present")} className="h-8 rounded-lg bg-success/10 text-success hover:bg-success/20 border-0">Present</Button>
                <Button size="sm" onClick={() => bulkMark("absent")} className="h-8 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 border-0">Absent</Button>
                <Button size="sm" onClick={() => bulkMark("late")} className="h-8 rounded-lg bg-warning/10 text-warning hover:bg-warning/20 border-0">Late</Button>
              </div>
            </div>)}

          <div className="glass-panel rounded-2xl overflow-hidden animate-fade-up" style={{ animationDelay: "80ms" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 w-10">
                      <input type="checkbox" checked={selected.size === users.length} onChange={() => setSelected(selected.size === users.length ? new Set() : new Set(users.map((u) => u.id)))} className="rounded"/>
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Department</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter((u) => u.status === "active").map((u) => (<tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.has(u.id)} onChange={() => toggleSelect(u.id)} className="rounded"/>
                      </td>
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{u.department}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => toggleStatus(u.id)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all active:scale-95 ${statusColor(attendance[u.id])}`}>
                          {statusIcon(attendance[u.id])}
                          <span className="capitalize">{attendance[u.id]}</span>
                        </button>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="glass-panel rounded-2xl p-6 animate-fade-up" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
              <ChevronLeft className="w-4 h-4"/>
            </button>
            <span className="text-sm font-semibold">{monthName}</span>
            <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
              <ChevronRight className="w-4 h-4"/>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (<div key={d} className="text-[10px] font-medium text-muted-foreground py-1">{d}</div>))}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`}/>)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            return (<div key={day} className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-colors cursor-default ${isToday ? "gradient-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}>
                  {day}
                </div>);
        })}
          </div>
        </div>
      </div>
    </div>);
}
