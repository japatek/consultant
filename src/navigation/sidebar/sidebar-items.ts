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
  Pencil,
  Trophy,
  Book,
} from "lucide-react";
import type { TranslationType } from "@/translate/language-data"; // Import the type

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
  isActive?: boolean; 
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

// Ubah menjadi fungsi yang menerima parameter 'id' dan 't' (objek terjemahan)
export const sidebarItems = (id: string, t: TranslationType): NavGroup[] => [
  {
    id: 1,
    label: t.navPlatform,
    items: [
      {
        title: t.navArticle,
        url: `/landing/article`,
        icon: Book,
      },
      {
        title: t.navCertificate,
        url: `/interface`, 
        icon: Trophy,
      },
      {
        title: t.navTraining,
        url: "/dashboard/platoverview",
        icon: Pencil,
      },
      // {
      //   title: "Research",
      //   url: "/dashboard/platresearch",
      //   icon: Activity,
      // },
    ],
  },

  // {
  //   id: 2,
  //   label: "Consumption",
  //   items: [
  //     {
  //       title: "API Keys",
  //       url: "/dashboard/api-keys",
  //       icon: Key,
  //     },
  //     {
  //       title: "Usage & Billing",
  //       url: "/dashboard/usage",
  //       icon: LineChart,
  //       isActive: true, // Forces collapsible to open
  //       subItems: [
  //         { title: "View Token",        url: "/dashboard/usage/viewtoken",        newTab: false },
  //         { title: "Manager",           url: "/dashboard/usage/manager",          newTab: false },
  //         { title: "Caching",           url: "/dashboard/usage/cache",            newTab: false },
  //         { title: "Billing",           url: "/dashboard/usage/billing",          newTab: false },
  //         { title: "Rate Limit",        url: "/dashboard/usage/rate-limit",       newTab: false },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 2,
  //   label: "Crafting",
  //   items: [
  //     {
  //       title: "Build",
  //       url: "/dashboard/build",
  //       icon: Wrench,
  //       isActive: true,
  //       subItems: [
  //         { title: "Skills",    url: "/dashboard/build/skills",    newTab: false },
  //         { title: "Files",     url: "/dashboard/build/files",     newTab: false },
  //         { title: "Batches",   url: "/dashboard/build/batches",   newTab: false },
  //         { title: "Tools",     url: "/dashboard/build/tools",     newTab: false }
  //       ],
  //     },
      // {
      //   title: "Manage Agent",
      //   url: "/dashboard/agents",
      //   icon: BotIcon,
      //   isActive: true,
      //   subItems: [
      //     { title: "Quickstart",        url: "/dashboard/agents/quickstart",   newTab: false },
      //     { title: "Agents",            url: "/dashboard/agents/agent",        newTab: false },
      //     { title: "Sessions",          url: "/dashboard/agents/sessions",     newTab: false },
      //     { title: "Environment",       url: "/dashboard/agents/environment",  newTab: false },
      //     { title: "Credential Vaults", url: "/dashboard/agents/vaults",       newTab: false },
      //     { title: "Memory Stores",     url: "/dashboard/agents/memory",       newTab: false },
      //     { title: "Deployment",        url: "/dashboard/agents/deploy",       newTab: false },
      //   ],
      // },
      // {
      //   title: "Control",
      //   url: "/dashboard/control",
      //   icon: Gauge,
      //   isActive: true,
      //   subItems: [
      //     { title: "Model",    url: "/dashboard/control/model",    newTab: false },
      //     { title: "Runtime",  url: "/dashboard/control/runtime",  newTab: false },
      //     { title: "Activity", url: "/dashboard/control/activity", newTab: false },
      //     { title: "Task",     url: "/dashboard/control/task",     newTab: false },
      //     { title: "Schedule", url: "/dashboard/control/schedule", newTab: false },
      //     { title: "Logs",     url: "/dashboard/control/logs",     newTab: false },
      //   ],
      // },
  //   ],
  // },
  // {
  //   id: 4,
  //   label: "Research",
  //   items: [
  //     {
  //       title: "Code",
  //       url: "/dashboard/research/code",
  //       icon: Code2,
  //       isActive: true,
  //       subItems: [
  //         { title: "Usage",    url: "/dashboard/research/code/usage",    newTab: false },
  //         { title: "Settings", url: "/dashboard/research/code/settings", newTab: false },
  //       ],
  //     },
  //     {
  //       title: "Draw",
  //       url: "/dashboard/research/draw",
  //       icon: Sparkle,
  //       isActive: true,
  //       subItems: [
  //         { title: "Usage",    url: "/dashboard/research/draw/usage",    newTab: false },
  //         { title: "Settings", url: "/dashboard/research/draw/settings", newTab: false },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 3,
  //   label: "Viewport",
  //   items: [

  //     {
  //       title: "Viewport",
  //       url: "/dashboard/viewports",
  //       icon: Radio,
  //     },
  //     {
  //       title: "Account",
  //       url: "/dashboard/accounts",
  //       icon: Users,
  //     },
  //   ],
  // },
  // --- NEW SECTIONS FROM THE IMAGE ---
  // {
  //   id: 6,
  //   label: "Management",
  //   items: [
  //     {
  //       title: "Users",
  //       url: "/dashboard/users",
  //       icon: Users,
  //     },
  //     {
  //       title: "Roles",
  //       url: "/dashboard/roles",
  //       icon: Lock,
  //     },
  //     {
  //       title: "Authentication",
  //       url: "/auth",
  //       icon: Fingerprint,
  //       subItems: [
  //         { title: "Login v1", url: "/auth/v1/login", newTab: true },
  //         { title: "Login v2", url: "/auth/v2/login", newTab: true },
  //         { title: "Register v1", url: "/auth/v1/register", newTab: true },
  //         { title: "Register v2", url: "/auth/v2/register", newTab: true },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 7,
  //   label: "Dashboards",
  //   items: [
  //     {
  //       title: "CRM",
  //       url: "/dashboard/crm",
  //       icon: ChartBar,
  //     },
  //     {
  //       title: "Finance",
  //       url: "/dashboard/finance",
  //       icon: Banknote,
  //     },
  //     {
  //       title: "Analytics",
  //       url: "/dashboard/analytics",
  //       icon: Gauge,
  //     },
  //     {
  //       title: "Productivity",
  //       url: "/dashboard/productivity",
  //       icon: Activity,
  //     },
  //     {
  //       title: "E-commerce",
  //       url: "/dashboard/ecommerce",
  //       icon: ShoppingBag,
  //     },
  //     {
  //       title: "Academy",
  //       url: "/dashboard/academy",
  //       icon: GraduationCap,
  //     },
  //     {
  //       title: "Logistics",
  //       url: "/dashboard/logistics",
  //       icon: Forklift,
  //     },
  //   ],
  // },
  // {
  //   id: 8,
  //   label: "Legacy",
  //   items: [
  //     {
  //       title: "Legacy Dashboards",
  //       url: "/dashboard/default-v1",
  //       subItems: [
  //         { title: "Default V1", url: "/dashboard/default-v1" },
  //         { title: "CRM V1", url: "/dashboard/crm-v1" },
  //         { title: "Finance V1", url: "/dashboard/finance-v1" },
  //         { title: "Analytics V1", url: "/dashboard/analytics-v1" },
  //       ],
  //     },
  //   ],
  // },
  
];