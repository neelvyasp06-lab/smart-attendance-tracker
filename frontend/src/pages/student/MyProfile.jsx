import { useAuth } from "@/hooks/useAuth";
import { users } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Building, Shield, User } from "lucide-react";
export default function MyProfile() {
    const { userName, userId } = useAuth();
    const student = users.find((u) => u.id === userId) || { name: userName, email: "", department: "", role: "student", status: "active" };
    const fields = [
        { label: "Full Name", value: student.name, icon: User },
        { label: "Email", value: student.email, icon: Mail },
        { label: "Class", value: student.department, icon: Building },
        { label: "Role", value: student.role, icon: Shield },
    ];
    return (<div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Your personal information</p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
              {student.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <CardTitle className="text-lg">{student.name}</CardTitle>
              <Badge variant="default" className="mt-1 text-xs capitalize">{student.status}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fields.map((f) => (<div key={f.label} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                  <f.icon className="w-4 h-4 text-muted-foreground"/>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                  <p className="text-sm font-medium capitalize">{f.value}</p>
                </div>
              </div>))}
          </div>
        </CardContent>
      </Card>
    </div>);
}
