"use client"

import { createContext, useCallback, useContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react"
import type { ArtifactFile } from "../_lib/types"

interface PanelContextValue {
  artifactFiles: ArtifactFile[]
  setArtifactFiles: Dispatch<SetStateAction<ArtifactFile[]>>
  selectedFileId: string | null
  selectedFile: ArtifactFile | null
  isArtifactOpen: boolean
  isCodePanelOpen: boolean
  codePanelTab: "code" | "flow"
  setCodePanelTab: (tab: "code" | "flow") => void
  openArtifact: () => void
  closeArtifact: () => void
  openCodePanel: (fileId?: string) => void
  closeCodePanel: () => void
  setSelectedFileId: any
}

const PanelContext = createContext<PanelContextValue | null>(null)

export function PanelProvider({
  children,
  // Keep the prop to prevent TypeScript errors in ChatShell if it's still being passed,
  // but we will ignore its value for initialization.
  initialArtifactOpen = false, 
}: {
  children: ReactNode
  initialArtifactOpen?: boolean
}) {
  const [artifactFiles, setArtifactFiles] = useState<ArtifactFile[]>([])
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  
  // FIX: Force this to always initialize as `false` regardless of cookies/preferences
  const [isArtifactOpen, setIsArtifactOpen] = useState(false) 
  
  const [isCodePanelOpen, setIsCodePanelOpen] = useState(false)
  const [codePanelTab, setCodePanelTab] = useState<"code" | "flow">("code")

  const selectedFile = useMemo(
    () => artifactFiles.find((f) => f.id === selectedFileId) ?? null,
    [artifactFiles, selectedFileId],
  )

  const openArtifact = useCallback(() => {
    setIsCodePanelOpen(false)
    setIsArtifactOpen(true)
  }, [])

  const closeArtifact = useCallback(() => setIsArtifactOpen(false), [])

  const openCodePanel = useCallback((fileId?: string) => {
    if (fileId) setSelectedFileId(fileId)
    setIsArtifactOpen(false)
    setIsCodePanelOpen(true)
  }, [])

  const closeCodePanel = useCallback(() => setIsCodePanelOpen(false), [])

  const value = useMemo<PanelContextValue>(
    () => ({
      artifactFiles,
      setArtifactFiles,
      selectedFileId,
      selectedFile,
      isArtifactOpen,
      isCodePanelOpen,
      codePanelTab,
      setCodePanelTab,
      openArtifact,
      closeArtifact,
      openCodePanel,
      closeCodePanel,
      setSelectedFileId
    }),
    [artifactFiles, selectedFileId, selectedFile, isArtifactOpen, isCodePanelOpen, codePanelTab, openArtifact, closeArtifact, openCodePanel, closeCodePanel],
  )

  return <PanelContext.Provider value={value}>{children}</PanelContext.Provider>
}

export function usePanelContext() {
  const ctx = useContext(PanelContext)
  if (!ctx) throw new Error("usePanelContext must be used within PanelProvider")
  return ctx
}