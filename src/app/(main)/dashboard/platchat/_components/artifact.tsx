"use client"

import { memo } from "react"
import { FileCodeIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Artifact, ArtifactHeader, ArtifactTitle, ArtifactDescription, ArtifactActions, ArtifactContent, ArtifactClose } from "@/components/ai/artifact"
import { Shimmer } from "@/components/ai/shimmer"
import { usePanelContext } from "./chat-context"

function ArtifactPanelImpl() {
  const { isArtifactOpen, closeArtifact, artifactFiles, isCodePanelOpen, selectedFile, openCodePanel } = usePanelContext()

  return (
    <Artifact isOpen={isArtifactOpen} className="fixed right-0 top-0 h-screen z-50 shadow-2xl border-l border-border/50 bg-card">
      <ArtifactHeader className="bg-background">
        <div className="flex flex-col">
          <ArtifactTitle className="flex items-center gap-2">
            <FileCodeIcon className="h-4 w-4 text-primary" />
            Artifact
          </ArtifactTitle>
          <ArtifactDescription>Files generated in this session</ArtifactDescription>
        </div>
        <ArtifactActions>
          <ArtifactClose className="cursor-pointer" onClick={closeArtifact} />
        </ArtifactActions>
      </ArtifactHeader>

      <ArtifactContent className="overflow-y-auto bg-muted/20 p-3">
        {artifactFiles.length === 0 ? (
          <div className="space-y-2 p-2">
            <Shimmer className="h-10 w-full rounded-md" />
            <Shimmer className="h-10 w-full rounded-md" />
            <Shimmer className="h-10 w-3/4 rounded-md" />
          </div>
        ) : (
          <div className="space-y-1.5">
            {artifactFiles.map((f) => (
              <button
                key={f.id}
                onClick={() => openCodePanel(f.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md border px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent",
                  isCodePanelOpen && selectedFile?.id === f.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 bg-card text-foreground",
                )}
              >
                <FileCodeIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{f.filename}</span>
              </button>
            ))}
          </div>
        )}
      </ArtifactContent>
    </Artifact>
  )
}

export const ArtifactPanel = memo(ArtifactPanelImpl)