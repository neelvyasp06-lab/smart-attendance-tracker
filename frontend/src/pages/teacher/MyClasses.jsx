import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users } from "lucide-react";
import { toast } from "sonner";
import API_URL from "@/config";

export default function MyClasses() {
    const { user } = useAuth();
    const token = user?.token;
    const [myClasses, setMyClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyClasses = async () => {
            try {
                const res = await fetch(`${API_URL}/api/classes`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error("Failed to fetch classes");
                const data = await res.json();
                
                // For each class, fetch names of students
                const enrichedClasses = await Promise.all(data.map(async (cls) => {
                    const classRes = await fetch(`${API_URL}/api/classes/${cls.classId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (classRes.ok) return await classRes.json();
                    return cls;
                }));
                
                setMyClasses(enrichedClasses);
            } catch (error) {
                toast.error("Failed to load classes");
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchMyClasses();
    }, [token]);

    if (loading) return <div className="py-8 text-center text-muted-foreground">Loading classes...</div>;

    return (<div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Classes</h1>
        <p className="text-muted-foreground text-sm mt-1">Classes and subjects assigned to you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myClasses.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed">
            No classes assigned yet.
          </div>
        ) : myClasses.map((c) => {
            const classStudents = c.students || [];
            return (<Card key={c.classId || c.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary"/>
                  </div>
                  <div>
                    <CardTitle className="text-base">{c.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{c.subject} · Section {c.section}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Users className="w-4 h-4"/>
                  <span>{classStudents.length} students</span>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {classStudents.length === 0 ? (
                      <p className="text-xs italic text-muted-foreground">No students in this class</p>
                  ) : classStudents.map((s) => (<div key={s.userId || s.id} className="flex items-center gap-2 text-sm py-1 border-b border-border/40 last:border-0">
                      <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-medium border border-border">
                        {(s.name || "U").split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{s.name}</span>
                        <span className="text-[10px] text-muted-foreground">{s.userId}</span>
                      </div>
                    </div>))}
                </div>
              </CardContent>
            </Card>);
        })}
      </div>
    </div>);
}
