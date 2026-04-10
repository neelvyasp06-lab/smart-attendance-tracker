import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Pencil, Trash2, UserPlus, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ManageUsers() {
    const { user } = useAuth();
    const token = user?.token;

    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [isDeleting, setIsDeleting] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/auth/users", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setUserList(data);
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };
    const [modalOpen, setModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [form, setForm] = useState({ name: "", email: "", role: "student", department: "" });
    const filtered = (userList || []).filter((u) => {
        if (!u) return false;
        const name = u.name || "";
        const email = u.email || "";
        const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || 
                           email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === "all" || u.role === roleFilter;
        return matchSearch && matchRole;
    });
    const openAdd = () => {
        setEditUser(null);
        setForm({ name: "", email: "", role: "student", department: "" });
        setModalOpen(true);
    };
    const openEdit = (u) => {
        setEditUser(u);
        setForm({ name: u.name, email: u.email, role: u.role, department: u.department });
        setModalOpen(true);
    };
    const handleSave = async () => {
        try {
            if (editUser) {
                const res = await fetch(`/api/auth/${editUser._id || editUser.id}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                });
                if (res.ok) {
                    toast.success("User updated successfully");
                    fetchUsers();
                }
            }
            else {
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ ...form, userId: `u-${Date.now()}` })
                });
                if (res.ok) {
                    toast.success("User added successfully");
                    fetchUsers();
                } else {
                    const data = await res.json();
                    toast.error(data.message || "Failed to add user");
                }
            }
            setModalOpen(false);
        } catch (error) {
            toast.error("Error saving user");
        }
    };
    const confirmDelete = (u) => {
        setUserToDelete(u);
        setDeleteConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (!userToDelete) return;
        const deleteId = userToDelete._id || userToDelete.id;
        
        console.log('Final confirmation to delete user:', deleteId);
        setIsDeleting(true);

        try {
            const res = await fetch(`/api/auth/${deleteId}`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || "User deleted successfully");
                fetchUsers();
            } else {
                toast.error(data.message || "Failed to delete user");
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error("Error connecting to server");
        } finally {
            setIsDeleting(false);
            setDeleteConfirmOpen(false);
            setUserToDelete(null);
        }
    };
    const roleBadgeColor = (role) => {
        if (role === "admin")
            return "bg-primary/10 text-primary";
        if (role === "teacher")
            return "bg-accent/10 text-accent";
        return "bg-secondary text-secondary-foreground";
    };
    return (<div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Users</h1>
          <p className="text-muted-foreground text-sm mt-1">Add, edit, or remove teachers and students</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <UserPlus className="w-4 h-4"/> Add User
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
              <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9"/>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All roles"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="teacher">Teachers</SelectItem>
                <SelectItem value="student">Students</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Name</th>
                  <th className="pb-3 font-medium text-muted-foreground">Email</th>
                  <th className="pb-3 font-medium text-muted-foreground">Role</th>
                  <th className="pb-3 font-medium text-muted-foreground">Department</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                    <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Loading users...</td></tr>
                ) : (filtered || []).map((u) => (<tr key={u._id || u.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 font-medium">{u.name}</td>
                    <td className="py-3 text-muted-foreground">{u.email}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadgeColor(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{u.department}</td>
                    <td className="py-3">
                      <Badge variant={u.status === "active" ? "default" : "secondary"} className="text-xs">
                        {u.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(u)}>
                          <Pencil className="w-3.5 h-3.5"/>
                        </Button>
                        {u.role !== "admin" && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive" 
                            onClick={() => confirmDelete(u)}
                          >
                            <Trash2 className="w-3.5 h-3.5"/>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>))}
                {!loading && filtered.length === 0 && (<tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No users found</td></tr>)}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertCircle className="w-5 h-5" />
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              <span className="font-semibold text-foreground mx-1">
                {userToDelete?.name} ({userToDelete?.email})
              </span>
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editUser ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter name"/>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Enter email"/>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Department / Class</Label>
              <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="e.g. Class 10-A or Mathematics"/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editUser ? "Save Changes" : "Add User"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);
}
