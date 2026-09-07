"use client";

import { useState } from "react";
import { CircleUser, CreditCard, LogOut, MessageSquareDot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { getInitials } from "../../../../lib/utils";

import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger
} from "../../../../components/ui/alert-dialog";

import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import { AccountDialog } from "../../../../components/ui/account-dialog";
import { useProfileCache, clearCachedProfile } from "../../../../lib/auth/use-profile-cache";

interface UserProps {
  readonly name: string;
  readonly email: string;
  readonly image?: string | null; // Matches Prisma / Auth.js schema
}

export function UserMenu({ user }: { readonly user: UserProps }) {
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Read name/image from the local browser cache first (instant, no DB
  // round trip); falls back to the session-provided `user` prop until the
  // cache has been seeded. Updated instantly by the profile editor on save.
  const displayUser = useProfileCache(user?.email ?? "", user?.name ?? null, user?.image ?? null);
  const displayName = displayUser.name || user?.name || "";
  const displayImage = displayUser.image;

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach((cookieName) => {
      if (cookieName.includes("next-auth") || cookieName.includes("auth")) {
        Cookies.remove(cookieName, { path: "/" });
        Cookies.remove(cookieName, { path: "/", domain: window.location.hostname });
      }
    });
    // Wipe the cached avatar/name too, so the next person on this browser
    // doesn't briefly see the previous account's profile.
    clearCachedProfile();

    await signOut({
      redirect: true,
      callbackUrl: "/"
    });
  };

  return (
    <>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="size-8 rounded-lg cursor-pointer">
              <AvatarImage src={displayImage || undefined} alt={displayName} className="object-cover" />
              <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
            {/* Profile header (session + local cache) */}
            <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
              <Avatar className="size-9 rounded-lg">
                <AvatarImage src={displayImage || undefined} alt={displayName} className="object-cover" />
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{displayName}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>

            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => setIsAccountOpen(true)}
              >
                <CircleUser />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <MessageSquareDot />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />

            {/* Uses AlertDialogTrigger directly to handle the modal workflow */}
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-destructive cursor-pointer">
                <LogOut />
                Log out
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logout Confirmation Dialog Content */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will end your current session. You will need to log in again to access your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* DITAMBAHKAN variant dan size di sini */}
            <AlertDialogCancel 
              variant="outline" 
              size="default" 
              className="cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            
            {/* DITAMBAHKAN variant dan size di sini */}
            <AlertDialogAction
              variant="default"
              size="default"
              onClick={handleSignOut}
              className="bg-red hover:bg-red/40 cursor-pointer"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AccountDialog
        open={isAccountOpen}
        onOpenChange={setIsAccountOpen}
        user={{
          name: displayName,
          email: user.email,
          image: displayImage,
        }}
      />
    </>
  );
}