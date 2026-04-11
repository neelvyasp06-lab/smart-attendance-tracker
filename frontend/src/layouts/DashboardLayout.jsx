import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { notifications } from "@/data/mockData";
import { LayoutDashboard, Users, CalendarCheck, BookOpen, UserCheck, ChevronLeft, ChevronRight, Bell, Moon, Sun, LogOut, Scan, Menu, ClipboardList, User, } from "lucide-react";
import { Badge } from "@/components/ui/badge";
const navByRole = {
    admin: [
        { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
        { label: "Manage Users", icon: Users, path: "/admin/users" },
        { label: "Assign Teachers", icon: UserCheck, path: "/admin/assign" },
    ],
    teacher: [
        { label: "Dashboard", icon: LayoutDashboard, path: "/teacher/dashboard" },
        { label: "My Classes", icon: BookOpen, path: "/teacher/classes" },
        { label: "Students", icon: Users, path: "/teacher/students" },
        { label: "Mark Attendance", icon: CalendarCheck, path: "/teacher/attendance" },
        { label: "Records", icon: ClipboardList, path: "/teacher/records" },
    ],
    student: [
        { label: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
        { label: "My Profile", icon: User, path: "/student/profile" },
        { label: "My Attendance", icon: CalendarCheck, path: "/student/attendance" },
    ],
};
export default function DashboardLayout() {
    const { userName, role, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navItems = role ? navByRole[role] : [];
    const unreadCount = notifications.filter((n) => !n.read).length;
    const initials = userName.split(" ").map((n) => n[0]).join("");
    return (<div className="min-h-screen flex bg-background">
      {mobileOpen && (<div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)}/>)}

      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen flex flex-col border-r border-border bg-card transition-all duration-300 ${collapsed ? "w-[68px]" : "w-60"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center gap-2 px-4 h-16 border-b border-border shrink-0">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-lg">N</span>
          </div>
          {!collapsed && <span className="font-bold text-sm tracking-tight">Attendance System</span>}
        </div>

        {!collapsed && (<div className="px-4 pt-4 pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{role} Panel</span>
          </div>)}

        <nav className="flex-1 py-2 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (<Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${active
                    ? "gradient-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? "" : "group-hover:scale-110 transition-transform"}`}/>
                {!collapsed && <span>{item.label}</span>}
              </Link>);
        })}
        </nav>

        <div className="hidden lg:flex justify-end px-3 py-3 border-t border-border">
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            {collapsed ? <ChevronRight className="w-4 h-4"/> : <ChevronLeft className="w-4 h-4"/>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted text-muted-foreground">
            <Menu className="w-5 h-5"/>
          </button>
          <div className="hidden lg:block"/>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors active:scale-95">
              {theme === "dark" ? <Sun className="w-[18px] h-[18px]"/> : <Moon className="w-[18px] h-[18px]"/>}
            </button>

            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors relative active:scale-95">
                <Bell className="w-[18px] h-[18px]"/>
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"/>}
              </button>
              {notifOpen && (<>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)}/>
                  <div className="absolute right-0 mt-2 w-80 z-50 glass-panel rounded-2xl shadow-2xl overflow-hidden animate-fade-up">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <span className="font-semibold text-sm">Notifications</span>
                      <Badge variant="secondary" className="text-xs">{unreadCount} new</Badge>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((n) => (<div key={n.id} className={`p-4 border-b border-border last:border-0 ${!n.read ? "bg-primary/5" : ""}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium">{n.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                            </div>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</span>
                          </div>
                        </div>))}
                    </div>
                  </div>
                </>)}
            </div>

            <div className="flex items-center gap-3 ml-2 pl-3 border-l border-border">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium leading-tight">{userName}</p>
                <p className="text-[11px] text-muted-foreground capitalize">{role}</p>
              </div>
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                {initials}
              </div>
              <button onClick={logout} className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors active:scale-95">
                <LogOut className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>);
}
