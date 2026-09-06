"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { Badge } from "../../../../src/components/ui/badge";
import { Button } from "../../../../src/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../../../../src/components/ui/command";
import type { NavMainItem } from "../../../../src/navigation/sidebar/sidebar-items";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";

// 1. Import the useLanguage hook
import { useLanguage } from "@/hooks/use-language";

type SearchItem = {
  group: string;
  label: string;
  url: string;
  icon?: NavMainItem["icon"];
  disabled?: boolean;
  newTab?: boolean;
};

function getAvailableItems(items: SearchItem[]) {
  return items.filter((item) => !item.disabled && !item.url.includes("coming-soon"));
}

function groupBy(items: SearchItem[]) {
  const groups = [...new Set(items.map((item) => item.group))];
  return groups.map((group) => ({
    group,
    items: items.filter((item) => item.group === group),
  }));
}

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  
  const router = useRouter();

  const { data: session } = useSession();
  const id = session?.user?.id; 

  // 2. Extract 't' from useLanguage
  const { t } = useLanguage();

  // 3. Pass 't' to sidebarItems and add it to the dependency array
  const sidebarData = React.useMemo(() => {
    if (!id) return []; 
    return sidebarItems(id, t);
  }, [id, t]);

  // 4. Proses data jika sidebarData terisi
  const { searchItems, recommendations } = React.useMemo(() => {
    if (sidebarData.length === 0) {
      return { searchItems: [], recommendations: [] };
    }

    const groupLabels = new Set(sidebarData.flatMap((group) => (group.label ? [group.label] : [])));

    function getSubItemGroup(groupLabel: string | undefined, itemTitle: string) {
      return groupLabels.has(itemTitle) ? (groupLabel ?? "Other") : itemTitle;
    }

    const items: SearchItem[] = sidebarData.flatMap((group) =>
      group.items.flatMap((item) => {
        if (item.subItems) {
          return item.subItems.map((sub) => ({
            group: getSubItemGroup(group.label, item.title),
            label: sub.title,
            url: sub.url,
            icon: item.icon,
            disabled: sub.comingSoon,
            newTab: sub.newTab,
          }));
        }
        return [
          {
            group: group.label ?? "Other",
            label: item.title,
            url: item.url,
            icon: item.icon,
            disabled: item.comingSoon,
            newTab: item.newTab,
          },
        ];
      }),
    );

    return {
      searchItems: items,
      recommendations: getAvailableItems(items),
    };
  }, [sidebarData]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) setQuery("");
  };

  const handleSelect = (item: SearchItem) => {
    if (item.disabled) return;
    handleOpenChange(false);
    if (item.newTab) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    } else {
      router.push(item.url);
    }
  };

  const renderGroups = (items: SearchItem[]) =>
    groupBy(items).map(({ group, items: groupItems }, index) => (
      <React.Fragment key={group}>
        {index > 0 && <CommandSeparator />}
        <CommandGroup heading={group}>
          {groupItems.map((item) => (
            <CommandItem
              disabled={item.disabled}
              key={`${group}-${item.url}-${item.label}`}
              value={`${item.group} ${item.label}`}
              onSelect={() => handleSelect(item)}
            >
              {item.icon && <item.icon />}
              <span>{item.label}</span>

              {item.disabled && (
                <Badge variant="outline" className="text-xs">
                  Soon
                </Badge>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </React.Fragment>
    ));

  return (
    <>
      <Button
        onClick={() => handleOpenChange(true)}
        variant="link"
        className="px-0! font-normal text-muted-foreground hover:no-underline"
      >
        <Search data-icon="inline-start" />
        Search
        <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium text-[10px]">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <Command>
          <CommandInput placeholder="Search dashboards, users, and more…" value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {query ? renderGroups(searchItems) : renderGroups(recommendations)}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}