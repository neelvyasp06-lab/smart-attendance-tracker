import { useState } from "react";
import { users as initialUsers } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search, Plus, X, Pencil } from "lucide-react";
export default function UsersPage() {
    const [userList, setUserList] = useState(initialUsers);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [deptFilter, setDeptFilter] = useState("all");
    const [modalOpen, setModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const departments = [...new Set(initialUsers.map((u) => u.department))];
    const filtered = userList.filter((u) => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === "all" || u.role === roleFilter;
        const matchDept = deptFilter === "all" || u.department === deptFilter;
        return matchSearch && matchRole && matchDept;
    });
    const openAdd = () => { setEditUser(null); setModalOpen(true); };
    const openEdit = (u) => { setEditUser(u); setModalOpen(true); };
    const handleSave = (data) => {
        if (editUser) {
            setUserList((prev) => prev.map((u) => (u.id === editUser.id ? { ...u, ...data } : u)));
        }
        else {
            const newUser = {
                id: String(Date.now()),
                name: data.name || "",
                email: data.email || "",
                role: data.role || "student",
                department: data.department || "Engineering",
                status: "active",
            };
            setUserList((prev) => [...prev, newUser]);
        }
        setModalOpen(false);
    };
    return (<div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="page-header">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">{userList.length} registered users</p>
        </div>
        <Button onClick={openAdd} className="gradient-primary text-primary-foreground rounded-xl h-10 active:scale-[0.97] transition-transform">
          <Plus className="w-4 h-4 mr-2"/> Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 animate-fade-up" style={{ animationDelay: "80ms" }}>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
          <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 rounded-xl bg-secondary/50"/>
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm">
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm">
          <option value="all">All Departments</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-hidden animate-fade-up" style={{ animationDelay: "160ms" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-6 py-4 font-medium text-muted-foreground hidden sm:table-cell">Email</th>
                <th className="text-left px-6 py-4 font-medium text-muted-foreground">Role</th>
                <th className="text-left px-6 py-4 font-medium text-muted-foreground hidden md:table-cell">Department</th>
                <th className="text-left px-6 py-4 font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (<tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                      {u.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    {u.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">{u.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="capitalize rounded-lg text-xs">{u.role}</Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">{u.department}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.status === "active" ? "text-success" : "text-muted-foreground"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.status === "active" ? "bg-success" : "bg-muted-foreground"}`}/>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors active:scale-95">
                      <Pencil className="w-3.5 h-3.5"/>
                    </button>
                  </td>
                </tr>))}
              {filtered.length === 0 && (<tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No users found matching your filters.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && <UserModal user={editUser} onClose={() => setModalOpen(false)} onSave={handleSave} departments={departments}/>}
    </div>);
}
function UserModal({ user, onClose, onSave, departments }) {
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [role, setRole] = useState(user?.role || "student");
    const [department, setDepartment] = useState(user?.department || departments[0]);
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative glass-panel rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{user ? "Edit User" : "Add User"}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="w-4 h-4"/></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave({ name, email, role: role, department }); }} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-10 rounded-xl bg-secondary/50" required/>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 rounded-xl bg-secondary/50" required/>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Role</Label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm">
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Department</Label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm">
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-10 rounded-xl">Cancel</Button>
            <Button type="submit" className="flex-1 h-10 rounded-xl gradient-primary text-primary-foreground">Save</Button>
          </div>
        </form>
      </div>
    </div>);
}
