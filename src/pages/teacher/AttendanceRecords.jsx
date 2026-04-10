import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar } from "lucide-react";

export default function AttendanceRecords() {
    const { user } = useAuth();
    const token = user?.token;

    const [myClasses, setMyClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await fetch("/api/classes", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMyClasses(data);
                    if (data.length > 0) setSelectedClassId(data[0].classId);
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
        const fetchRecords = async () => {
            if (!selectedClassId) return;
            try {
                const res = await fetch(`/api/attendance/class/${selectedClassId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setRecords(data);
                }
            } catch (error) {
                toast.error("Failed to load attendance records");
            }
        };
        if (token && selectedClassId) fetchRecords();
    }, [token, selectedClassId]);

    const groupedRecords = records.reduce((acc, rec) => {
        const date = new Date(rec.date).toDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(rec);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedRecords).sort((a, b) => new Date(b) - new Date(a));

    if (loading) return <div className="py-8 text-center text-muted-foreground">Loading records...</div>;

    return (<div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance Records</h1>
          <p className="text-muted-foreground text-sm mt-1">View past attendance for your classes</p>
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

      <div className="space-y-4">
        {sortedDates.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground italic border-dashed border-2 m-4 rounded-xl">No records found for this class.</CardContent></Card>
        ) : sortedDates.map((date) => {
            const dayRecords = groupedRecords[date];
            const present = dayRecords.filter(r => r.status === "present").length;
            const absent = dayRecords.filter(r => r.status === "absent").length;

            return (<Card key={date} className="overflow-hidden">
                <div className="px-4 py-3 bg-muted/30 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Calendar className="w-4 h-4 text-primary"/>
                    {date}
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span className="text-green-600 font-medium">{present} Present</span>
                    <span className="text-destructive font-medium">{absent} Absent</span>
                  </div>
                </div>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-border">
                      {dayRecords.map((r, i) => (
                        <tr key={i} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 font-medium">{r.userId}</td>
                          <td className="px-4 py-3 capitalize">
                             <Badge variant={r.status === "present" ? "default" : r.status === "absent" ? "destructive" : "secondary"} className="text-[10px]">
                                {r.status}
                             </Badge>
                          </td>
                          <td className="px-4 py-3 text-right text-xs text-muted-foreground italic">
                            {r.subject}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>);
        })}
      </div>
    </div>);
}
