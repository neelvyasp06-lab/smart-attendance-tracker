import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";
// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageUsers from "@/pages/admin/ManageUsers";
import AssignTeacher from "@/pages/admin/AssignTeacher";
// Teacher pages
import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import MyClasses from "@/pages/teacher/MyClasses";
import StudentsList from "@/pages/teacher/StudentsList";
import MarkAttendance from "@/pages/teacher/MarkAttendance";
import AttendanceRecords from "@/pages/teacher/AttendanceRecords";
// Student pages
import StudentDashboard from "@/pages/student/StudentDashboard";
import MyProfile from "@/pages/student/MyProfile";
import MyAttendance from "@/pages/student/MyAttendance";
const queryClient = new QueryClient();
function AppRoutes() {
    const { isAuthenticated, role } = useAuth();
    if (!isAuthenticated) {
        return (<Routes>
        <Route path="*" element={<LoginPage />}/>
      </Routes>);
    }
    const defaultRoute = role === "admin" ? "/admin/dashboard" : role === "teacher" ? "/teacher/dashboard" : "/student/dashboard";
    return (<Routes>
      <Route element={<DashboardLayout />}>
        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />}/>
        <Route path="/admin/users" element={<ManageUsers />}/>
        <Route path="/admin/assign" element={<AssignTeacher />}/>

        {/* Teacher routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />}/>
        <Route path="/teacher/classes" element={<MyClasses />}/>
        <Route path="/teacher/students" element={<StudentsList />}/>
        <Route path="/teacher/attendance" element={<MarkAttendance />}/>
        <Route path="/teacher/records" element={<AttendanceRecords />}/>

        {/* Student routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />}/>
        <Route path="/student/profile" element={<MyProfile />}/>
        <Route path="/student/attendance" element={<MyAttendance />}/>
      </Route>

      <Route path="/" element={<Navigate to={defaultRoute} replace/>}/>
      <Route path="*" element={<NotFound />}/>
    </Routes>);
}
const App = () => (<QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>);
export default App;
