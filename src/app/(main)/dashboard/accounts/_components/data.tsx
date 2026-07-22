
import { 
  LucideIcon,
  SquareUserRound,
  UserCog,
  BriefcaseBusiness,
  ShieldCheck,
  UserRound
 } from "lucide-react";


export type UserStatus = "Active" | "Pending invite" | "Deactivated" | "Locked" | "Suspended";
const teamValues = ["Platform", "Growth", "Revenue", "Customer Ops", "Internal Tools", "Compliance", "People Ops", "Finance"] as const;
export type UserTeam = (typeof teamValues)[number];

export type UserRow = {
  id: string;
  email: string;
  joinedDate: string;
  lastActive: number;
  name: string;
  role: string;
  status: UserStatus;
  team: UserTeam;
  workspace: string[];
  emailVerified: Date | null;
  image: string | null;
};


export const filters = {
  role: [
    "All",
    "Workspace Owner",
    "Admin",
    "Billing Admin",
    "Security Admin",
    "Team Lead",
    "Contributor",
    "Guest",
    "Read-only",
  ],
  team: ["All", ...teamValues], // Pastikan const teamValues ada di atas
  status: ["All", "Active", "Pending invite", "Deactivated", "Locked", "Suspended"],
  workspace: ["All", "Weblabs Studio", "Sandbox", "Internal Tools", "Acme Inc."],
};

export const roleMeta: Record<string, { className: string; icon: LucideIcon }> = {
  "Workspace Owner": { className: "text-emerald-300", icon: SquareUserRound },
  Admin: { className: "text-amber-300", icon: UserCog },
  "Billing Admin": { className: "text-violet-300", icon: BriefcaseBusiness },
  "Security Admin": { className: "text-orange-300", icon: ShieldCheck },
  "Team Lead": { className: "text-fuchsia-300", icon: UserRound },
  Contributor: { className: "text-rose-300", icon: UserRound },
  Guest: { className: "text-muted-foreground", icon: UserRound },
  "Read-only": { className: "text-muted-foreground", icon: UserRound },
};

export const statusMeta: Record<UserStatus, { badgeClass: string; dotClass: string }> = {
  Active: {
    badgeClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
  },
  "Pending invite": {
    badgeClass: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dotClass: "bg-amber-500",
  },
  Deactivated: {
    badgeClass: "border-border bg-muted/50 text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
  Locked: {
    badgeClass: "border-destructive/20 bg-destructive/10 text-destructive",
    dotClass: "bg-destructive",
  },
  Suspended: {
    badgeClass: "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400",
    dotClass: "bg-orange-500",
  },
};