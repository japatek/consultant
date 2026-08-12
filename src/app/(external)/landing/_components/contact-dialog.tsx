"use client";

import React, { useActionState, useEffect, useState, useRef } from "react";
import { Loader2, Send, Paperclip, CheckCircle2 } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { submitContact, type ContactFormState } from "../_lib/contact-action";

const INITIAL_STATE: ContactFormState = { error: null, success: false };
const MAX_FILE_SIZE = 1024 * 1024; // 1 MB

export function ContactDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(submitContact, INITIAL_STATE);
  
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [widgetKey, setWidgetKey] = useState(0);
  const [fileError, setFileError] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  // Handle client-side file validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setFileError("Only PDF files are allowed.");
        e.target.value = "";
      } else if (file.size > MAX_FILE_SIZE) {
        setFileError("File exceeds 1MB limit.");
        e.target.value = "";
      }
    }
  };

  // Handle server responses
  useEffect(() => {
    if (state.success) {
      setTurnstileToken("");
      formRef.current?.reset();
      setTimeout(() => setOpen(false), 2000); // Close modal after 2s on success
    } else if (state.error) {
      setTurnstileToken("");
      setWidgetKey((prev) => prev + 1); // Reset widget on error
    }
  }, [state]);

  // Reset states when modal closes
  useEffect(() => {
    if (!open) {
      setFileError("");
      setTurnstileToken("");
      setWidgetKey((prev) => prev + 1);
      state.error = null;
      state.success = false;
    }
  }, [open, state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary text-white font-medium shadow-md hover:shadow-lg transition-all">
          Contact Myself
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">Get in Touch</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill out the form below. I will receive your message via email.
          </DialogDescription>
        </DialogHeader>

        {state.success ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3 text-center">
            <CheckCircle2 className="size-12 text-teal" />
            <p className="text-lg font-semibold text-foreground">Message Sent!</p>
            <p className="text-sm text-muted-foreground">Thank you for reaching out. I'll get back to you soon.</p>
          </div>
        ) : (
          <form ref={formRef} action={formAction} className="space-y-4 mt-2">
            <input type="hidden" name="turnstile-token" value={turnstileToken} />

            {state.error && (
              <div className="p-3 text-sm rounded-md bg-destructive/10 border border-destructive/20 text-destructive">
                {state.error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" required placeholder="John Doe" disabled={isPending} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone / WhatsApp</Label>
                <Input id="phone" name="phone" placeholder="+62 812..." disabled={isPending} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required placeholder="john@example.com" disabled={isPending} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea 
                id="message" 
                name="message" 
                required 
                placeholder="How can I help you?" 
                className="min-h-[100px] resize-none"
                disabled={isPending} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file" className="flex items-center gap-2">
                <Paperclip className="size-4" /> Optional Document (PDF, max 1MB)
              </Label>
              <Input 
                id="file" 
                name="file" 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange}
                disabled={isPending}
                className="file:text-teal file:font-medium file:bg-teal/10 hover:file:bg-teal/20 file:border-0 file:mr-4 file:py-1 file:px-3 file:rounded-md"
              />
              {fileError && <p className="text-xs text-destructive">{fileError}</p>}
            </div>

            {/* Turnstile Integration */}
            <div className="pt-2">
               <Turnstile
                  key={widgetKey}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                  options={{ action: "contact" }}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => {
                    setTurnstileToken("");
                    setWidgetKey(prev => prev + 1);
                  }}
                  onExpire={() => setTurnstileToken("")}
                />
            </div>

            <Button
              type="submit"
              disabled={isPending || !turnstileToken || !!fileError}
              className="w-full bg-gradient-primary text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" /> Sending...
                </>
              ) : (
                <>
                  Send Message <Send className="size-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}