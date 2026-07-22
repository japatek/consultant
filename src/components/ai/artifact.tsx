"use client"

import {
  CopyIcon,
  DownloadIcon,
  ShareIcon,
  XIcon,
} from "lucide-react"
import { useState, type ComponentProps, type HTMLAttributes, type ElementType } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { CodeBlock } from "@/components/ai/code-block" // Pastikan import ini sesuai dengan path Anda

export type ArtifactProps = HTMLAttributes<HTMLDivElement> & {
  isOpen?: boolean
}

export const Artifact = ({ className, isOpen = true, ...props }: ArtifactProps) => (
  <div
    className={cn(
      "sticky top-0 h-screen z-40 shrink-0 flex flex-col bg-muted/5 transition-all duration-500 ease-in-out overflow-hidden border-border/60",
      isOpen 
        ? "w-[400px] lg:w-[600px] opacity-100 border-l" 
        : "w-0 opacity-0 pointer-events-none border-l-0",
      className,
    )}
    {...props}
  />
)

export type ArtifactHeaderProps = HTMLAttributes<HTMLDivElement>

export const ArtifactHeader = ({ className, ...props }: ArtifactHeaderProps) => (
  <div
    className={cn("flex h-14 shrink-0 items-center justify-between border-b bg-background/40 backdrop-blur-md px-4", className)}
    {...props}
  />
)

export type ArtifactCloseProps = ComponentProps<typeof Button>

export const ArtifactClose = ({
  className,
  children,
  size = "sm",
  variant = "ghost",
  ...props
}: ArtifactCloseProps) => (
  <Button
    className={cn("size-8 p-0 text-muted-foreground hover:text-destructive transition-colors", className)}
    size={size}
    type="button"
    variant={variant}
    {...props}
  >
    {children ?? <XIcon className="size-4" />}
    <span className="sr-only">Close</span>
  </Button>
)

export type ArtifactTitleProps = HTMLAttributes<HTMLParagraphElement>

export const ArtifactTitle = ({ className, ...props }: ArtifactTitleProps) => (
  <p className={cn("font-semibold text-foreground text-sm tracking-wide", className)} {...props} />
)

export type ArtifactDescriptionProps = HTMLAttributes<HTMLParagraphElement>

export const ArtifactDescription = ({ className, ...props }: ArtifactDescriptionProps) => (
  <p className={cn("text-muted-foreground text-xs", className)} {...props} />
)

export type ArtifactActionsProps = HTMLAttributes<HTMLDivElement>

export const ArtifactActions = ({ className, ...props }: ArtifactActionsProps) => (
  <div className={cn("flex items-center gap-1", className)} {...props} />
)

export type ArtifactActionProps = Omit<ComponentProps<typeof Button>, "icon"> & {
  tooltip?: string
  label?: string
  icon?: ElementType 
}

export const ArtifactAction = ({
  tooltip,
  label,
  icon: Icon,
  children,
  className,
  size = "sm",
  variant = "ghost",
  ...props
}: ArtifactActionProps) => {
  const button = (
    <Button
      className={cn("size-8 p-0 text-muted-foreground hover:text-foreground transition-colors", className)}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      {Icon ? <Icon className="size-4" /> : children}
      <span className="sr-only">{label || tooltip}</span>
    </Button>
  )

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return button
}

export type ArtifactContentProps = HTMLAttributes<HTMLDivElement>

export const ArtifactContent = ({ className, ...props }: ArtifactContentProps) => (
  <div className={cn("flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-b from-background to-muted/20", className)} {...props} />
)

/** Demo component for preview */
export default function ArtifactDemo() {
  const [isOpen, setIsOpen] = useState(true)

  const code = `# Dijkstra's Algorithm implementation
import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    heap = [(0, start)]
    visited = set()

    while heap:
        current_distance, current_node = heapq.heappop(heap)
        if current_node in visited:
            continue
        visited.add(current_node)

        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(heap, (distance, neighbor))

    return distances`

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    toast("Copied to clipboard", {
      description: "Code snippet has been copied safely.",
      action: {
        label: "Dismiss",
        onClick: () => console.log("Dismissed"),
      },
    })
  }

  return (
    <div className="flex w-full justify-end relative h-screen">
      {/* Tombol pembantu untuk membuka kembali panel saat tertutup */}
      {!isOpen && (
        <div className="absolute top-4 right-4 z-50">
          <Button onClick={() => setIsOpen(true)} variant="outline">
            Open Artifact
          </Button>
        </div>
      )}

      <Artifact isOpen={isOpen}>
        <ArtifactHeader>
          <div>
            <ArtifactTitle>Dijkstra's Algorithm</ArtifactTitle>
            <ArtifactDescription>Updated 1 minute ago</ArtifactDescription>
          </div>
          <ArtifactActions>
            {/* Tombol Copy menggunakan fungsi Sonner Toast */}
            <ArtifactAction 
              icon={CopyIcon} 
              tooltip="Copy to clipboard" 
              onClick={handleCopy} 
            />
            <ArtifactAction icon={DownloadIcon} tooltip="Download" />
            <ArtifactAction icon={ShareIcon} tooltip="Share" />
            <div className="mx-1 h-4 w-px bg-border/60" />
            <ArtifactClose onClick={() => setIsOpen(false)} />
          </ArtifactActions>
        </ArtifactHeader>
        
        <ArtifactContent className="p-0">
          <CodeBlock className="border-none" code={code} language="python" showLineNumbers />
        </ArtifactContent>
      </Artifact>
    </div>
  )
}