import {
  LayoutDashboard,
  User,
  FileText,
  History,
  Trophy,
  Settings,
  Users,
  ClipboardList,
  HelpCircle,
  BarChart3,
  ShieldCheck,
  Building2,
  Ticket,
  GraduationCap,
  Brain,
  Award,
} from "lucide-react";

export const STUDENT_LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/resume", label: "Resume", icon: FileText },
  { to: "/aptitude", label: "Aptitude test", icon: Brain },
  { to: "/history", label: "Interview history", icon: History },
  { to: "/achievements", label: "Achievements", icon: Award },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const ADMIN_LINKS = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/colleges", label: "Colleges & TPOs", icon: Building2 },
  { to: "/admin/redeem-codes", label: "Redeem codes", icon: Ticket },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/interviews", label: "Interviews", icon: ClipboardList },
  { to: "/admin/questions", label: "Questions", icon: HelpCircle },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/users", label: "All users", icon: ShieldCheck },
];

export const TPO_LINKS = [
  { to: "/tpo/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/tpo/students", label: "My students", icon: GraduationCap },
  { to: "/tpo/redeem-codes", label: "Redeem codes", icon: Ticket },
  { to: "/tpo/settings", label: "Settings", icon: Settings },
];
