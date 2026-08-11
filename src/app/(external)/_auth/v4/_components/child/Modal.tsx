// ------------------------------------------
// Modal.tsx
// ------------------------------------------
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  isConfirmDisabled?: boolean;
  isLoading?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  message,
  isConfirmDisabled = false,
  isLoading = false,
}: Readonly<ModalProps>) {
  const disabled = isConfirmDisabled || isLoading;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-[90%] rounded-xl border bg-panel p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Confirm</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={onConfirm}
            disabled={disabled}
            className={`${
              disabled ? "opacity-60 cursor-not-allowed" : ""
            } bg-red-600 hover:bg-red-700 text-white`}
          >
            {isLoading ? "Deleting..." : "OK"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* Rename modal */

interface RenameModalProps {
  isOpen: boolean;
  currentTitle: string;
  onClose: () => void;
  onConfirm: (newTitle: string) => void;
  isLoading?: boolean;
}

export function RenameModal({
  isOpen,
  currentTitle,
  onClose,
  onConfirm,
  isLoading = false,
}: Readonly<RenameModalProps>) {
  const [value, setValue] = useState(currentTitle);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(currentTitle);
      setTimeout(() => inputRef.current?.select(), 50);
    }
  }, [isOpen, currentTitle]);

  const trimmed = value.trim();
  const unchanged = trimmed === currentTitle.trim();
  const disabled = isLoading || !trimmed || unchanged;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) onConfirm(trimmed);
    if (e.key === "Escape") onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-[90%] rounded-xl border bg-panel p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Rename Session</DialogTitle>
        </DialogHeader>

        <div className="mb-6">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            New Name
          </Label>
          <Input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            maxLength={80}
            placeholder="Enter session name"
            className={`w-full rounded-lg px-4 py-3 text-sm ${isLoading ? "opacity-60" : ""}`}
          />
          <div className="text-right text-xs text-muted-foreground mt-2 opacity-70">
            {value.length}/80
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={() => !disabled && onConfirm(trimmed)}
            disabled={disabled}
            className={`${
              disabled ? "opacity-60 cursor-not-allowed" : ""
            } text-white`}
            style={
              !disabled
                ? { boxShadow: "0 8px 20px rgba(0,212,200,0.18)" }
                : undefined
            }
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
