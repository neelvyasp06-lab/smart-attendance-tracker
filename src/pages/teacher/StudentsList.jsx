import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function StudentsList() {
    const { user } = useAuth();
    const token = user?.token;

    const [myClasses, setMyClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

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
                    else setLoading(false);
                }
            } catch (error) {
                toast.error("Failed to load classes");
                setLoading(false);
            }
        };
        if (token) fetchClasses();
    }, [token]);

    useEffect(() => {
        const fetchClassDetails = async () => {
            if (!selectedClassId) return;
            setLoading(true);
            try {
                const res = await fetch(`/api/classes/${selectedClassId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStudents(data.students || []);
                }
            } catch (error) {
                toast.error("Failed to load student list");
            } finally {
                setLoading(false);
            }
        };
        if (token && selectedClassId) fetchClassDetails();
    }, [token, selectedClassId]);

    const filtered = students.filter(s => 
        s.name.toLowerCase().includes(search.toLowerCase()) || 
        s.userId.toLowerCase().includes(search.toLowerCase())
    );

    return (<div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students List</h1>
          <p className="text-muted-foreground text-sm mt-1">View students in your assigned classes</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                <Input placeholder="Search name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10"/>
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
      </div>

      <Card>
        <CardContent className="p-4">
          {loading ? (
              <p className="py-8 text-center text-muted-foreground">Loading students...</p>
          ) : filtered.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No students found matching your criteria</p>
          ) : (<table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Name</th>
                  <th className="pb-3 font-medium text-muted-foreground">ID</th>
                  <th className="pb-3 font-medium text-muted-foreground">Department</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (<tr key={s.userId} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                          {(s.name || "U").split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="font-medium text-foreground">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground font-mono text-xs">{s.userId}</td>
                    <td className="py-3 text-muted-foreground">{s.department}</td>
                    <td className="py-3">
                      <Badge variant={s.status === "active" ? "default" : "secondary"} className="text-[10px] uppercase font-bold tracking-wider">
                         {s.status}
                      </Badge>
                    </td>
                  </tr>))}
              </tbody>
            </table>)}
        </CardContent>
      </Card>
    </div>);
}
