import { GetApiKey } from "@/components/ui/form-get-api-key";
import { DrawerContent } from "@/components/ui/drawer-with-side";

export interface OverviewButtonDataItem {
  id: string;
  label?: string;
  icon?: any;
  colorClass: string;
  hoverTitle: string;
  hoverDesc: string;
  redirect:boolean;
  dialog?:boolean;
  url?:any;
  content?:React.ComponentType;
}

export const buttonsData: OverviewButtonDataItem[] = [
  {
    id: "get-api",
    label: "Get API Key",
    icon: "KeyRound",
    colorClass: "bg-gold/10 hover:bg-gold/20 text-gold",
    hoverTitle: "API Access Keys",
    hoverDesc: "Generate secure API tokens to authenticate your background applications and webhooks.",
    redirect:false,
    content:GetApiKey
  },
  {
    id: "docs",
    label: "View Docs",
    icon: "FileText",
    colorClass: "bg-pink/10 hover:bg-pink/20 text-pink",
    hoverTitle: "API Documentation",
    hoverDesc: "Read our comprehensive guides, endpoint reference maps, and integration tutorials.",
    redirect: false,
    dialog:false,
    content:DrawerContent
  },
  {
    id: "build-agent",
    label: "Create Agent",
    icon: "WaypointsIcon",
    colorClass: "bg-teal/10 hover:bg-teal/20 text-teal",
    hoverTitle: "Build Agentic AI",
    hoverDesc: "Develop Agentic AI for doing spesific task using JSON or YAML configuration.",
    redirect:true,
    url:'/dashboard/agents/agent'
  }
];