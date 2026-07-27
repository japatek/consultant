"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { WelcomeDate } from "@/components/ui/welcomedate";
import { ProfileEditor } from "@/components/ui/profile";

export type AccountDialogUser = {
  name: string | null;
  email: string;
  image: string | null;
};

/**
 * Renders the exact same content as `app/dashboard/accounts/page.tsx`
 * (WelcomeDate + ProfileEditor) inside a Dialog, so it can be opened from
 * the "Account" item in both `nav-user.tsx` and `user-menu.tsx` without
 * navigating away from the current page.
 *
 * `user` is expected to be whatever the nav already has on hand (the
 * session-derived prop, refined by the local profile cache) — no extra
 * database fetch happens just to open this dialog.
 */
export function AccountDialog({
  open,
  onOpenChange,
  user,
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly user: AccountDialogUser;
}) {
  const greetingName = user.name
    ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
    : "How Are You?";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>View and update your account details.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <WelcomeDate name={greetingName} />
          <ProfileEditor user={{ name: user.name, email: user.email, image: user.image }} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
