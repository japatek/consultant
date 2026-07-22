import {
  Activity,
  Banknote,
  Bot,
  BotIcon,
  Calendar,
  ChartBar,
  Code2,
  Cpu,
  Fingerprint,
  Forklift,
  Gauge,
  GraduationCap,
  Kanban,
  Key,
  LayoutDashboard,
  LineChart,
  Lock,
  type LucideIcon,
  Mail,
  MessageSquare,
  Radio,
  RadioOffIcon,
  ReceiptText,
  Scissors,
  Settings,
  ShoppingBag,
  Sparkle,
  SquareArrowUpRight,
  Target,
  TargetIcon,
  Terminal,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean; // <-- Added this to control the open state
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const testSidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Platform",
    items: [
      {
        title: "Chat",
        url: "/dashboard/platchat",
        icon: MessageSquare,
      },
      {
        title: "Overview",
        url: "/dashboard/platoverview",
        icon: LayoutDashboard,
      },
      {
        title: "Crafting Prompt",
        url: "/dashboard/platcrafting",
        icon: Scissors,
      },
      {
        title: "Research",
        url: "/dashboard/platresearch",
        icon: Activity,
      },
    ],
  },
]