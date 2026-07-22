"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { revalidatePath } from "next/cache";
import { sendOTPEmail } from "@/lib/auth/email";

export interface UpdateActionState {
  success: boolean;
  otpRequired: boolean;
  message: string | null;
  error: string | null;
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function verifyCaptchaOnServer(token: string) {
  const secret = process.env.CAPTCHA_SECRET_KEY;
  if (!secret) return true;

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secret}&response=${token}`,
  });
  const data = await response.json();
  return data.success;
}

export async function updateUserProfile(
  prevState: UpdateActionState,
  dataToUpdate: {
    name?: string;
    email?: string;
    image?: string | null;
    captchaToken?: string;
  }
): Promise<UpdateActionState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, otpRequired: false, message: null, error: "Unauthorized. Please log in." };
    }

    const userId = session.user.id;
    const currentEmail = session.user.email;
    let otpRequired = false;

    if (dataToUpdate.image && dataToUpdate.image.length > 2 * 1024 * 1024) { 
      return { success: false, otpRequired: false, message: null, error: "Image is too large. Max 2MB." };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: dataToUpdate.name,
        image: dataToUpdate.image,
        updatedAt: new Date(),
      },
    });

    if (dataToUpdate.email && dataToUpdate.email !== currentEmail) {
      
      // ─── BUG 1 FIX: CHECK IF THE NEW EMAIL IS ALREADY TAKEN BY SOMEONE ELSE ───
      const existingEmailOwner = await prisma.user.findUnique({
        where: { email: dataToUpdate.email },
        select: { id: true }
      });

      if (existingEmailOwner && existingEmailOwner.id !== userId) {
        return { 
          success: false, 
          otpRequired: false, 
          message: null, 
          error: "This email address is already linked to another account." 
        };
      }

      // ─── MONTHLY LIMIT CHECK ───────────────────────────────────────────────
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const successfulChangesThisMonth = await prisma.emailChangeLog.count({
        where: {
          userId: userId,
          createdAt: { gte: startOfMonth },
        },
      });

      if (successfulChangesThisMonth >= 2) {
        return { 
          success: false, 
          otpRequired: false, 
          message: null, 
          error: "Security Policy: You can only change your email address twice a month." 
        };
      }

      // ─── BUG 3 FIX: 30-MINUTE OTP TIME GUARD RATE LIMIT ────────────────────
      const existingToken = await prisma.verificationToken.findFirst({
        where: { identifier: dataToUpdate.email }
      });

      if (existingToken) {
        const timeRemainingMs = existingToken.expires.getTime() - Date.now();
        if (timeRemainingMs > 0) {
          const minutesRemaining = Math.ceil(timeRemainingMs / (1000 * 60));
          return {
            success: false,
            otpRequired: true, // Set to true so the modal stays accessible in the UI
            message: "A verification code has already been sent to this address.",
            error: `Rate Limit: Please check your inbox. You can request a new code in ${minutesRemaining} minutes.`
          };
        }
      }

      // ─── CAPTCHA VALIDATION ────────────────────────────────────────────────
      if (!dataToUpdate.captchaToken) {
        return { success: false, otpRequired: false, message: null, error: "Security verification required." };
      }

      const isCaptchaValid = await verifyCaptchaOnServer(dataToUpdate.captchaToken);
      if (!isCaptchaValid) {
        return { success: false, otpRequired: false, message: null, error: "Invalid security verification. Please try again." };
      }

      // ─── GENERATE AND WRITE NEW OTP (EXPIRES IN 30 MINUTES) ────────────────
      const otpCode = generateOTP();
      const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes window

      await prisma.verificationToken.deleteMany({
        where: { identifier: dataToUpdate.email },
      });

      await prisma.verificationToken.create({
        data: {
          identifier: dataToUpdate.email,
          token: otpCode,
          expires: expires,
        }
      });

      await sendOTPEmail(dataToUpdate.email, otpCode);
      otpRequired = true;
    } else {
      revalidatePath("/dashboard/profile");
    }

    return { 
      success: true, 
      otpRequired: otpRequired,
      message: otpRequired 
        ? "Verification code sent! Please check your new email inbox." 
        : "Profile updated successfully!",
      error: null
    };

  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, otpRequired: false, message: null, error: "Server error occurred." };
  }
}

export async function verifyEmailOTP(newEmail: string, otpCode: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, message: "Unauthorized." };

    const record = await prisma.verificationToken.findFirst({
      where: { identifier: newEmail, token: otpCode }
    });

    if (!record) {
      return { success: false, message: "Invalid verification code." };
    }

    if (record.expires < new Date()) {
      return { success: false, message: "Verification code has expired. Please request a new one." };
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true }
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        email: newEmail,
        emailVerified: new Date(),
        updatedAt: new Date()
      }
    });

    await prisma.emailChangeLog.create({
      data: {
        userId: session.user.id,
        oldEmail: currentUser?.email || "unknown",
        newEmail: newEmail,
      },
    });

    await prisma.verificationToken.deleteMany({
      where: { identifier: newEmail }
    });

    revalidatePath("/dashboard/profile");
    return { success: true, message: "Email successfully updated!" };

  } catch (error) {
    console.error("OTP verification error:", error);
    return { success: false, message: "Server error during verification." };
  }
}