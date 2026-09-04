"use client";

import { useState } from "react";
import { BadgeCheck, Bell, CreditCard, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";

import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UserProps {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly avatar: string;
  readonly role: string;
}

export function UserMenu({ user }: { readonly user: UserProps }) {
  const router = useRouter();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

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

    await signOut({
      redirect: true,
      callbackUrl: "/"
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="size-8 rounded-lg cursor-pointer">
            <AvatarImage src={user.avatar || undefined} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
          {/* Static User Profile Header */}
          <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
            <Avatar className="size-9 rounded-lg">
              <AvatarImage src={user.avatar || undefined} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs capitalize text-muted-foreground">{user.role}</span>
            </div>
          </div>

          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/dashboard/accounts')}>
              <BadgeCheck />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <CreditCard />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Bell />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />

          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault(); 
              setIsLogoutDialogOpen(true);
            }}
            className="text-destructive cursor-pointer"
          >
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will end your current session. You will need to log in again to access your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignOut}
              className="bg-red hover:bg-red/40 cursor-pointer"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}