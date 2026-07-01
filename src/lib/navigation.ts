import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Dumbbell,
  CalendarRange,
  Tent,
  Trophy,
  FileBarChart2,
  Settings as SettingsIcon,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'לוח בקרה', icon: LayoutDashboard },
  { to: '/cadets', label: 'חניכים', icon: Users },
  { to: '/attendance', label: 'נוכחות', icon: ClipboardCheck },
  { to: '/fitness-tests', label: 'מבחני כושר', icon: Dumbbell },
  { to: '/training-plan', label: 'תוכנית אימונים', icon: CalendarRange },
  { to: '/weekend-missions', label: 'משימות סופ"ש', icon: Tent },
  { to: '/scoreboard', label: 'טבלת ניקוד', icon: Trophy },
  { to: '/reports', label: 'דוחות', icon: FileBarChart2 },
  { to: '/settings', label: 'הגדרות', icon: SettingsIcon },
];

export const MOBILE_NAV_ITEMS: NavItem[] = [
  NAV_ITEMS[0],
  NAV_ITEMS[1],
  NAV_ITEMS[2],
  NAV_ITEMS[6],
  NAV_ITEMS[8],
];
