"use client"

import { memo } from "react"
import { CopyIcon, DownloadIcon, CodeIcon, WorkflowIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable"
import { CodeBlock } from "@/components/ai/code-block"
import { FileTree, FileTreeFile } from "@/components/ai/file-tree"
import { usePanelContext } from "./chat-context"

type CodeLang = React.ComponentProps<typeof CodeBlock>["language"]

function CodePanelImpl() {
  const {
    artifactFiles, selectedFile, selectedFileId, setSelectedFileId,
    codePanelTab, setCodePanelTab, closeCodePanel,
  } = usePanelContext()

  const handleDownload = () => {
    if (!selectedFile) return
    const blob = new Blob([selectedFile.code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = selectedFile.filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={48} minSize={25}
        className="relative h-full bg-card border-l border-border/50 animate-in slide-in-from-right-4 duration-300"
      >
        <div className="flex h-full flex-col">

          <div className="flex items-center justify-between gap-2 border-b border-border/40 bg-background px-3 py-2 shrink-0">
            <span className="truncate text-sm font-medium text-foreground">{selectedFile?.filename ?? "Code"}</span>

            <div className="flex items-center gap-1 shrink-0">
              <div className="flex items-center bg-muted p-1 rounded-md mr-1">
                <Button variant={codePanelTab === "code" ? "secondary" : "ghost"} size="sm" className="h-7 text-xs px-2" onClick={() => setCodePanelTab("code")}>
                  <CodeIcon className="h-3 w-3 mr-1" /> Code
                </Button>
                <Button variant={codePanelTab === "flow" ? "secondary" : "ghost"} size="sm" className="h-7 text-xs px-2" onClick={() => setCodePanelTab("flow")}>
                  <WorkflowIcon className="h-3 w-3 mr-1" /> Flow
                </Button>
              </div>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" disabled={!selectedFile} onClick={() => selectedFile && navigator.clipboard.writeText(selectedFile.code)}>
                      <CopyIcon className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy code</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" disabled={!selectedFile} onClick={handleDownload}>
                      <DownloadIcon className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download file</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="mx-1 h-4 w-px bg-border" />
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={closeCodePanel}>
                <XIcon className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden min-h-0">
            {codePanelTab === "code" ? (
              <div className="flex h-full">
                {artifactFiles.length > 1 && (
                  <div className="w-44 shrink-0 overflow-y-auto border-r border-border/40 bg-background/40">
                    <FileTree className="p-2" selectedPath={selectedFileId} onSelect={setSelectedFileId}>
                      {artifactFiles.map((f) => <FileTreeFile key={f.id} path={f.id} name={f.filename} />)}
                    </FileTree>
                  </div>
                )}
                <div className="flex-1 overflow-y-auto">
                  {selectedFile ? (
                    <CodeBlock className="border-none h-full rounded-none" code={selectedFile.code} language={selectedFile.language as CodeLang} showLineNumbers />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No file selected</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-xs text-muted-foreground">
                Flow view is not available for this file.
              </div>
            )}
          </div>
        </div>
      </ResizablePanel>
    </>
  )
}

export const CodePanel = memo(CodePanelImpl)