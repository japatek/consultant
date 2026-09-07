"use client";

import * as React from "react";
import { CircleUser, CreditCard, EllipsisVertical, LogOut, MessageSquareDot } from "lucide-react";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../components/ui/alert-dialog";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../../../../components/ui/sidebar";
import { getInitials } from "../../../../lib/utils";
import Cookies from "js-cookie";
import { AccountDialog } from "../../../../components/ui/account-dialog";
import { useProfileCache, clearCachedProfile } from "../../../../lib/auth/use-profile-cache";

export function NavUser({
  user,
}: {
  readonly user: {
    readonly name: string;
    readonly email: string;
    readonly image?: string | null; 
  };
}) {
  const { isMobile } = useSidebar();
  const [isAccountOpen, setIsAccountOpen] = React.useState(false);

  // Read name/image from the local browser cache first (instant, no DB
  // round trip); falls back to the session-provided `user` prop until the
  // cache has been seeded. Updated instantly by the profile editor on save.
  const displayUser = useProfileCache(user.email, user.name, user.image ?? null);
  const displayName = displayUser.name || user.name;
  const displayImage = displayUser.image;

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
  }
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {/* Hapus grayscale agar warna asli gambar muncul */}
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={displayImage || undefined} alt={displayName} className="object-cover" />
                  <AvatarFallback className="rounded-lg">{getInitials(displayName)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-muted-foreground text-xs">{user.email}</span>
                </div>
                <EllipsisVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={displayImage || undefined} alt={displayName} className="object-cover" />
                    <AvatarFallback className="rounded-lg">{getInitials(displayName)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{displayName}</span>
                    <span className="truncate text-muted-foreground text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
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

              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive cursor-pointer">
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will end your current session. You will need to log in again to access your dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline" size="default" className="cursor-pointer">
                Cancel
              </AlertDialogCancel>
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}