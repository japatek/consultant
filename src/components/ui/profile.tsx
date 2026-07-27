"use client";

import { useState, useActionState, useEffect, startTransition, useCallback } from "react"; // 1. Add useCallback import
import { useRouter, useSearchParams } from "next/navigation";
import { Save, Trash2, MailWarning, CheckCircle, KeyRound } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { UpdateActionState, updateUserProfile, verifyEmailOTP } from "./action"; 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CapWidget } from "@/components/ui/cap-widget";
import { setCachedProfile } from "@/lib/auth/use-profile-cache";

type ProfileEditorProps = {
  user: {
    id?: string;
    name: string | null;
    email: string;
    image: string | null;
  };
};

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Kimberly",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
];

const INITIAL_STATE: UpdateActionState = { 
  success: false, 
  otpRequired: false, 
  message: null, 
  error: null 
};

export function ProfileEditor({ user }: ProfileEditorProps) {
  const router = useRouter(); 
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const { update } = useSession();
  
  // UI & Dialog States
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false); 
  const [localError, setLocalError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  
  // Captcha States
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [widgetKey, setWidgetKey] = useState<number>(0);
  
  // 2. MEMOIZE THE CAPTCHA CALLBACKS TO STOP THE VISUAL RESET
  const handleCaptchaVerify = useCallback((token: string) => {
    setCaptchaToken(token);
  }, []);

  const handleCaptchaExpire = useCallback(() => {
    setCaptchaToken("");
  }, []);

  // OTP Dialog States
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [actionProcessed, setActionProcessed] = useState(false);

  // Server Action Hook
  const [state, formAction, isPending] = useActionState(updateUserProfile, INITIAL_STATE);
  
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    image: user.image,
  });

  const isEmailChanged = formData.email.trim() !== user.email;

  // 2. WATCHER FIXED WITH GATEKEEPER CONDITION
  useEffect(() => {
    if (state.success && !actionProcessed) {
      // Immediately lock the door so subsequent re-renders don't re-trigger this block
      setActionProcessed(true);

      if (state.otpRequired) {
        setIsOtpDialogOpen(true);
      } else {
        // Update the client-side nav cache immediately (no DB round trip
        // needed to know the new avatar/name — we already have it here),
        // then sync the NextAuth session + re-fetch server data.
        setCachedProfile({
          email: formData.email,
          name: formData.name,
          image: formData.image,
        });

        update({
          user: {
            name: formData.name,
            image: formData.image,
          },
        }).then(() => {
          setIsSuccessDialogOpen(true);
          router.refresh();
        });
      }
    }
  }, [state, actionProcessed, router, update, formData.name, formData.image, formData.email]);

  const handleSelectPreset = (url: string) => {
    setFormData({ ...formData, image: url });
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: null });
  };

  // --- SUBMIT STAGE 1 ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (isEmailChanged && !captchaToken) {
      setLocalError("Please complete the security verification first.");
      return;
    }

    // 3. RESET LOCK BEFORE DESPATCHING A NEW SUBMISSION
    setActionProcessed(false);

    startTransition(() => {
      formAction({
        name: formData.name,
        email: formData.email,
        image: formData.image,
        captchaToken: isEmailChanged ? captchaToken : undefined
      });
    });
  };

  // --- SUBMIT STAGE 2: OTP VERIFICATION ---
  const handleVerifyOtp = async () => {
    if (otpCode.length < 6) return;
    setOtpError(null);
    
    setIsVerifyingOtp(true);
    const result = await verifyEmailOTP(formData.email, otpCode);
    setIsVerifyingOtp(false);

    if (result.success) {
      // Clear OTP Modal before running the async cookie session rewrite
      setIsOtpDialogOpen(false);
      setOtpCode("");

      // Same idea as the non-OTP path: refresh the nav cache the moment
      // we know the change is confirmed, don't wait on the DB.
      setCachedProfile({
        email: formData.email,
        name: formData.name,
        image: formData.image,
      });

      await update({
        user: {
          name: formData.name,
          email: formData.email,
          image: formData.image,
        },
      });

      setIsSuccessDialogOpen(true);
      router.refresh(); 
    } else {
      setOtpError(result.message);
    }
  };

  const fallbackLetter = formData.name 
    ? formData.name.charAt(0).toUpperCase() 
    : formData.email.charAt(0).toUpperCase();

  let displayError = localError || state.error;

  if (!displayError && urlError) {
    switch (urlError) {
      case "Configuration":
        displayError = "Server configuration error. Please try again later.";
        break;
      case "AccessDenied":
        displayError = "Access denied. You do not have permission to sign in.";
        break;
      case "Verification":
        displayError = "The verification link is invalid or has expired.";
        break;
      default:
        displayError = `Authentication error: ${urlError}`;
    }
  }

  return (
    <>
     <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {displayError && (
            <div className="mx-6 mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-in fade-in">
              {displayError}
            </div>
          )}
          
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Choose from the served avatars, update your name, and email details.</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Profile Picture Avatar</Label>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 border rounded-lg p-4 bg-muted/30">
                <div className="relative group flex items-center justify-center self-start">
                  <Avatar className="h-20 w-20 ring-2 ring-border">
                    <AvatarImage src={formData.image || undefined} className="object-cover" />
                    <AvatarFallback className="border-4 border-emerald-600 bg-sky-600 text-4xl font-medium text-white/70 dark:border-emerald-800 dark:bg-cyan-900 dark:text-white/50">
                      {fallbackLetter}
                    </AvatarFallback>
                  </Avatar>
                  {formData.image && (
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon"
                      className="absolute -top-1 -right-1 h-6 w-6 rounded-full shadow-md"
                      onClick={handleRemoveImage} 
                      title="Remove profile avatar"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-2">Select from standard avatar presets:</p>
                  <div className="grid grid-cols-6 gap-2 max-w-sm">
                    {PRESET_AVATARS.map((avatarUrl, idx) => {
                      const isSelected = formData.image === avatarUrl;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectPreset(avatarUrl)}
                          className={`relative rounded-full overflow-hidden transition-all duration-200 aspect-square border-2 ${
                            isSelected 
                              ? "border-primary ring-2 ring-primary/20 scale-105" 
                              : "border-transparent hover:border-muted-foreground/50 hover:scale-105"
                          }`}
                        >
                          <img 
                            src={avatarUrl} 
                            alt={`Avatar Preset ${idx + 1}`} 
                            className="w-full h-full object-cover bg-muted"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              
              {isEmailChanged && (
                <div className="mt-4 animate-in fade-in duration-300 space-y-4 border p-4 rounded-lg bg-input/50 dark:bg-input/50">
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <MailWarning className="size-5" />
                    Changing email requires security verification.
                  </p>
                  
                  <Label>
                    <span className="flex items-center">
                      Security verification
                      {captchaToken && <span className="ml-2 text-xs font-medium text-emerald-600 inline-flex items-center"><CheckCircle className="size-3 mr-1" />Verified</span>}
                    </span>
                  </Label>

                  {/* 3. PASS THE MEMOIZED HANDLERS HERE */}
                  <CapWidget
                    key={widgetKey}
                    onVerify={handleCaptchaVerify}
                    onExpire={handleCaptchaExpire}
                  />
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={isPending || (isEmailChanged && !captchaToken)}>
              {isPending ? "Saving..." : <><Save className="mr-2 size-4" /> Save Changes</>}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* DIALOG OTP */}
      <AlertDialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <KeyRound className="size-5 text-primary" /> Verify Your Email
            </AlertDialogTitle>
            <AlertDialogDescription>
              We've sent a 6-digit verification code to <strong>{formData.email}</strong>. Please enter the code below to finalize the change.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {otpError && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive text-center animate-in fade-in">
              {otpError}
            </div>
          )}

          <div className="py-4 flex justify-center">
             <Input 
               value={otpCode}
               onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
               placeholder="123456"
               className="text-center text-2xl tracking-widest font-mono max-w-[200px]"
               maxLength={6}
             />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isVerifyingOtp} onClick={() => setOtpError(null)}>Cancel</AlertDialogCancel>
            <Button onClick={handleVerifyOtp} disabled={otpCode.length < 6 || isVerifyingOtp}>
              {isVerifyingOtp ? "Verifying..." : "Verify & Update"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DIALOG SUKSES */}
      <AlertDialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Profile Updated!</AlertDialogTitle>
            <AlertDialogDescription>
              Your profile details have been successfully updated and saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsSuccessDialogOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
