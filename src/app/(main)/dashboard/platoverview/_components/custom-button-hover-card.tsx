'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OverviewButtonDataItem } from "@/navigation/button/overviewpage-button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

interface ButtonHoverCardProps {
  item: OverviewButtonDataItem;
}

export function ButtonHoverCard({ item }: ButtonHoverCardProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 1. ✅ PERBAIKAN: Pisahkan aksi klik berdasarkan item.id
  const handleClick = () => {
    if (item.redirect) {
      router.push(item.url);
    } else if (item.id === 'get-api') {
      setIsDialogOpen(true);
    } else if (item.id === 'docs') {
      setIsDrawerOpen(true);
    }
  };

  return (
    <>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button
            icon={item.icon}
            className={`cursor-pointer font-medium transition-colors flex items-center gap-2 ${item.colorClass}`}
            onClick={handleClick}
          >
            {item.label}
          </Button>
        </HoverCardTrigger>

        <HoverCardContent side="top" sideOffset={8} className="w-80">
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold text-foreground">
              {item.hoverTitle}
            </h4>
            <p className="text-xs text-muted-foreground">
              {item.hoverDesc}
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>

      {/* Dialog untuk Get API */}
      {item.id === 'get-api' && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="w-[90vw] sm:max-w-xl md:max-w-xl">
            <DialogHeader>
              <DialogTitle>{item.hoverTitle}</DialogTitle>
              <DialogDescription>
                {item.hoverDesc}
              </DialogDescription>
            </DialogHeader>
            {item.content && <item.content />}
          </DialogContent>
        </Dialog>
      )}

      {/* Drawer untuk Dokumentasi */}
      {item.id === 'docs' && (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
          <DrawerContent className="h-full max-w-md ml-auto"> 
            <DrawerHeader>
              <DrawerTitle>{item.hoverTitle}</DrawerTitle>
              <DrawerDescription>{item.hoverDesc}</DrawerDescription>
            </DrawerHeader>
            
            {/* Konten utama */}
            <div className="p-4 flex-1 overflow-y-auto">
              {item.content && <item.content />}
            </div>

            <DrawerFooter className="border-t">
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}