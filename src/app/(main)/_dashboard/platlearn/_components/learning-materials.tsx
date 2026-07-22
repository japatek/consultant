"use client";

import React, { useState } from "react";
import { Filter, Bookmark, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Make sure these match your Prisma output
export type DifficultyLevel = "Easy" | "Medium" | "Hard" | string;

export interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: DifficultyLevel;
  content: string; 
}

interface LearningMaterialsListProps {
  readonly materials: LearningMaterial[];
}

const getDifficultyStyles = (level: DifficultyLevel) => {
  switch (level?.toLowerCase()) {
    case "easy":
      return "bg-emerald-500/15 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400";
    case "medium":
      return "bg-orange-500/15 text-orange-600 border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400";
    case "hard":
      return "bg-red-500/15 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

export function LearningMaterialsList({ materials }: LearningMaterialsListProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<LearningMaterial | null>(null);

  if (!materials || materials.length === 0) {
    return (
      <div className="w-full p-6 text-center border rounded-lg border-dashed">
        <h3 className="text-lg font-semibold">No problems found</h3>
        <p className="text-muted-foreground">Add some materials via your admin dashboard to see them here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        
        {/* --- FILTER ROW --- */}
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-transparent border-muted-foreground/30 hover:bg-muted">
                <Filter className="size-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            
            {/* The Dropdown Filter Menu from your wireframe */}
            <PopoverContent className="w-72 p-4" align="start">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Status</Label>
                  <Select>
                    <SelectTrigger className="h-8 bg-muted/50 border-transparent">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="inprogress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Difficulty</Label>
                  <Select>
                    <SelectTrigger className="h-8 bg-muted/50 border-transparent">
                      <SelectValue placeholder="All Difficulties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Marked</Label>
                  <Select>
                    <SelectTrigger className="h-8 bg-muted/50 border-transparent">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bookmarked">Bookmarked</SelectItem>
                      <SelectItem value="none">Not Bookmarked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="h-7 px-3 text-xs rounded-full bg-muted/60 hover:bg-muted">
              Default filter 1
            </Button>
            <Button variant="secondary" size="sm" className="h-7 px-3 text-xs rounded-full bg-muted/60 hover:bg-muted">
              Default filter 2
            </Button>
            <Button variant="secondary" size="sm" className="h-7 px-3 text-xs rounded-full bg-muted/60 hover:bg-muted">
              Default filter 3
            </Button>
          </div>
        </div>

        {/* --- LIST CONTENT --- */}
        <div className="flex flex-col gap-2 w-full mt-2">
          {materials.map((material, index) => (
            <div 
              key={material.id} 
              onClick={() => setSelectedMaterial(material)}
              className="group flex items-center justify-between w-full p-2.5 px-4 rounded-xl bg-muted/40 hover:bg-muted border border-transparent transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground font-medium min-w-[20px]">
                  {index + 1}.
                </span>
                <span className="font-medium text-sm group-hover:text-primary transition-colors">
                  {material.title}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge 
                  variant="outline" 
                  className={cn("px-2 py-0 h-6 font-semibold uppercase text-[10px] tracking-wider rounded-md", getDifficultyStyles(material.level))}
                >
                  {material.level}
                </Badge>
                
                {/* Bookmark Icon */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="size-6 text-muted-foreground hover:text-foreground hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the sheet from opening when clicking bookmark
                    // Add your bookmark logic here later
                  }}
                >
                  <Bookmark className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- READING PANEL (Kept from previous setup) --- */}
      <Sheet open={!!selectedMaterial} onOpenChange={(open) => !open && setSelectedMaterial(null)}>
        <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col gap-0 border-l">
          {selectedMaterial && (
            <>
              <SheetHeader className="p-6 border-b shrink-0 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{selectedMaterial.category}</Badge>
                  <Badge variant="outline" className={getDifficultyStyles(selectedMaterial.level)}>
                    {selectedMaterial.level}
                  </Badge>
                </div>
                <SheetTitle className="text-2xl">{selectedMaterial.title}</SheetTitle>
                <SheetDescription>
                  Estimated time: {selectedMaterial.duration}
                </SheetDescription>
              </SheetHeader>
              
              <ScrollArea className="flex-1 p-6">
                <article className="prose dark:prose-invert prose-slate max-w-none">
                  <ReactMarkdown>
                    {selectedMaterial.content}
                  </ReactMarkdown>
                </article>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}