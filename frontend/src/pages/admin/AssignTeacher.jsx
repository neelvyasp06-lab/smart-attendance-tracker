import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BookOpen, UserCheck, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AssignTeacher() {
    const { user } = useAuth();
    const token = user?.token;

    const [classList, setClassList] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ name: "", section: "", subject: "", teacherId: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classesRes, usersRes] = await Promise.all([
                    fetch("/api/classes", { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch("/api/auth/users", { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                
                if (classesRes.ok && usersRes.ok) {
                    const classesData = await classesRes.json();
                    const usersData = await usersRes.json();
                    setClassList(classesData);
                    setTeachers(usersData.filter(u => u.role === "teacher"));
                }
            } catch (error) {
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchData();
    }, [token]);

    const getTeacherName = (id) => teachers.find((t) => (t.userId || t.id) === id)?.name ?? "Unassigned";

    const handleReassign = async (classId, newTeacherId) => {
        try {
            const res = await fetch(`/api/classes/${classId}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ teacherId: newTeacherId })
            });

            if (res.ok) {
                setClassList((prev) => prev.map((c) => c.classId === classId ? { ...c, teacherId: newTeacherId } : c));
                toast.success("Teacher reassigned successfully");
            } else {
                toast.error("Failed to reassign teacher");
            }
        } catch (error) {
            toast.error("Error connecting to server");
        }
    };

    const handleAdd = async () => {
        setSubmitting(true);
        try {
            const classId = `c-${Date.now()}`;
            const res = await fetch("/api/classes", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    classId,
                    name: form.name,
                    section: form.section,
                    subject: form.subject,
                    teacherId: form.teacherId
                })
            });

            if (res.ok) {
                const newClass = await res.json();
                setClassList((prev) => [...prev, newClass]);
                setModalOpen(false);
                setForm({ name: "", section: "", subject: "", teacherId: "" });
                toast.success("Class created and teacher assigned");
            } else {
                toast.error("Failed to create class");
            }
        } catch (error) {
            toast.error("Error creating class");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="py-8 text-center text-muted-foreground">Loading assignments...</div>;

    return (<div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assign Teachers</h1>
          <p className="text-muted-foreground text-sm mt-1">Assign or reassign teachers to classes and subjects</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4"/> New Assignment
        </Button>
      </div>

      <div className="grid gap-4">
        {classList.length === 0 ? (
            <Card className="border-dashed border-2 m-2"><CardContent className="py-12 text-center text-muted-foreground">No classes yet. Click "New Assignment" to get started.</CardContent></Card>
        ) : classList.map((c) => (<Card key={c.classId} className="hover:shadow-md transition-shadow group">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <BookOpen className="w-6 h-6 text-primary"/>
                  </div>
                  <div>
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">{c.name} — {c.subject}</p>
                    <p className="text-xs text-muted-foreground">Section {c.section} · {c.studentIds?.length || 0} students</p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-1 opacity-60 uppercase">{c.classId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-xl border border-border/50">
                  <div className="flex items-center gap-2 text-xs font-semibold px-2">
                    <UserCheck className="w-4 h-4 text-accent"/>
                    <span className="text-muted-foreground uppercase tracking-tighter">Assigned:</span>
                  </div>
                  <Select value={c.teacherId} onValueChange={(v) => handleReassign(c.classId, v)}>
                    <SelectTrigger className="w-[180px] bg-background">
                      <SelectValue>{getTeacherName(c.teacherId)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((t) => (<SelectItem key={t.userId} value={t.userId}>{t.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Class Assignment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Class Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. 4EV4 - AWT"/>
            </div>
            <div className="space-y-2">
              <Label>Section</Label>
              <Input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} placeholder="e.g. 4EV4"/>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Advanced Web Technology"/>
            </div>
            <div className="space-y-2">
              <Label>Assign Teacher</Label>
              <Select value={form.teacherId} onValueChange={(v) => setForm({ ...form, teacherId: v })}>
                <SelectTrigger><SelectValue placeholder="Select teacher"/></SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (<SelectItem key={t.userId} value={t.userId}>{t.name} — {t.department}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.name || !form.subject || !form.teacherId || submitting}>
               {submitting ? <Loader2 className="w-4 h-4 animate-spin"/> : "Create & Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);
}
