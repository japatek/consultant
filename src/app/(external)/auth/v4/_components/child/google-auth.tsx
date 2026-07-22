'use client'
import { useState } from "react";
import { signIn } from "next-auth/react"
import { Loader2 } from "lucide-react";

interface GoogleOauthProps {
  callbackUrl: string;
}
 
export function SignInGoogle({callbackUrl}:GoogleOauthProps) {
     const [connecting, setConnecting] = useState(false);
       const withGoogle = async () => {
         setConnecting(true);
         try {
           await signIn("google", { redirectTo: callbackUrl });
         } catch (err) {
           console.error("[OAuthButton] signInWithOIDC error:", err);
         } finally {
           setConnecting(false);
         }
       };
  return (

     <button
      type="button"
      onClick={withGoogle}
      disabled={connecting}
      className={`
        flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-border/60
        px-4 text-sm font-semibold transition-all duration-200 cursor-pointer
        ${connecting
          ? "cursor-not-allowed bg-gradient-to-br from-rose-400 to-emerald-600 text-white opacity-80"
          : "bg-card text-foreground hover:bg-gradient-to-br hover:from-rose-400 hover:to-emerald-600 hover:text-white"
        }
      `}
    >
      {connecting ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Connecting..</span>
        </>
      ) : (
        <>
          {/* Official Google "G" icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M23.766 12.276c0-.816-.066-1.636-.207-2.438H12.24v4.62h6.482a5.557 5.557 0 0 1-2.4 3.643v3h3.867c2.27-2.09 3.577-5.177 3.577-8.825Z" fill="#4285F4"/>
            <path d="M12.24 24c3.237 0 5.966-1.063 7.954-2.896l-3.867-3a7.231 7.231 0 0 1-4.087 1.148 7.243 7.243 0 0 1-6.732-5.003H1.517v3.091A12.002 12.002 0 0 0 12.24 24Z" fill="#34A853"/>
            <path d="M5.508 14.249A7.269 7.269 0 0 1 5.13 12a7.269 7.269 0 0 1 .378-2.249V6.66H1.517A11.997 11.997 0 0 0 .24 12c0 1.937.463 3.767 1.277 5.34l4.991-3.091Z" fill="#FBBC05"/>
            <path d="M12.24 4.75a6.506 6.506 0 0 1 4.6 1.798l3.43-3.43A11.525 11.525 0 0 0 12.24 0 12.002 12.002 0 0 0 1.517 6.66l3.991 3.091A7.243 7.243 0 0 1 12.24 4.75Z" fill="#EA4335"/>
          </svg>
          <span>Sign In With Google</span>
        </>
      )}
    </button>
  )
}