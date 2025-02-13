import {
  CalendarIcon,
  Home,
  Inbox,
  LayoutDashboard,
  Settings,
  UserRound,
} from "lucide-react";

const searchMenuItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Profile", url: "/profile", icon: UserRound },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Inbox", url: "/dashboard/inbox", icon: Inbox },
  { title: "Calendar", url: "/dashboard/calendar", icon: CalendarIcon },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];
