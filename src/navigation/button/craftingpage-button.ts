export interface CraftingButtonDataItem {
  id: string;
  label?: string;
  icon?: string;
  colorClass: string;
  hoverTitle: string;
  hoverDesc: string;
}

export const buttonsData: CraftingButtonDataItem[] = [
  {
    id: "create-prompt",
    icon: "Plus",
    colorClass: "bg-pink/10 hover:bg-pink/20 text-pink",
    hoverTitle: "Create System Prompt",
    hoverDesc: "Create System Prompt in Workspace \"Default\" "
  },
  {
    id: "list-prompts",
    icon: "List",
    colorClass: "bg-teal/10 hover:bg-teal/20 text-teal",
    hoverTitle: "View Prompt Lists",
    hoverDesc: "View all created prompts."
  },
];