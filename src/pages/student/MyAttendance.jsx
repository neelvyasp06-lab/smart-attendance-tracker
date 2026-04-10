import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function MyAttendance() {
    const { user } = useAuth();
    const token = user?.token;
    const userId = user?.userId;

    const [allRecords, setAllRecords] = useState([]);
    const [myClasses, setMyClasses] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                // Fetch student records
                const recordsRes = await fetch(`/api/attendance/student/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const recordsData = await recordsRes.json();
                setAllRecords(recordsData);

                // Fetch classes
                const classesRes = await fetch("/api/classes", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const classesData = await classesRes.json();
                setMyClasses(classesData.filter(c => c.studentIds.includes(userId)));
            } catch (error) {
                toast.error("Failed to load attendance history");
            } finally {
                setLoading(false);
            }
        };
        if (token && userId) fetchAttendanceData();
    }, [token, userId]);

    const filteredRecords = allRecords
        .filter((r) => filter === "all" || r.classId === filter)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const present = filteredRecords.filter((r) => r.status === "present").length;
    const absent = filteredRecords.filter((r) => r.status === "absent").length;
    const late = filteredRecords.filter((r) => r.status === "late").length;

    const statusColor = (s) => {
        if (s === "present") return "default";
        if (s === "absent") return "destructive";
        return "secondary";
    };

    if (loading) return <div className="py-8 text-center text-muted-foreground">Loading attendance history...</div>;

    return (<div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Attendance</h1>
          <p className="text-muted-foreground text-sm mt-1">Your complete attendance history</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All subjects"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {myClasses.map((c) => (<SelectItem key={c.classId} value={c.classId}>{c.subject} — {c.name}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-green-100 bg-green-50/20 shadow-sm border-b-2">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{present}</p>
            <p className="text-[10px] uppercase font-bold tracking-wider text-green-700/60 mt-1">Present</p>
          </CardContent>
        </Card>
        <Card className="border-red-100 bg-red-50/20 shadow-sm border-b-2">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-destructive">{absent}</p>
            <p className="text-[10px] uppercase font-bold tracking-wider text-red-700/60 mt-1">Absent</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-100 bg-yellow-50/20 shadow-sm border-b-2">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{late}</p>
            <p className="text-[10px] uppercase font-bold tracking-wider text-yellow-700/60 mt-1">Late</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          {filteredRecords.length === 0 ? (<p className="py-8 text-center text-muted-foreground italic">No attendance records found</p>) : (<div className="space-y-2">
              {filteredRecords.map((r, idx) => (<div key={idx} className="flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-muted/30 px-2 rounded-lg transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {new Date(r.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: 'numeric' })}
                    </p>
                    <p className="text-xs text-muted-foreground">{r.subject}</p>
                  </div>
                  <Badge variant={statusColor(r.status)} className="text-[10px] font-bold uppercase tracking-widest">{r.status}</Badge>
                </div>))}
            </div>)}
        </CardContent>
      </Card>
    </div>);
}
