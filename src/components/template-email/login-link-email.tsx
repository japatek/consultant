// emails/LoginLinkEmail.tsx
//
// React Email template for the magic-login-link message.
// Rendered to HTML + plain text by lib/email/email.ts via @react-email/render.
//
//   npm install @react-email/components @react-email/render

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
// import { Copyright } from "lucide-react";

export interface LoginLinkEmailProps {
  name?: string;
  loginUrl: string;
  appName?: string;
}

export default function LoginLinkEmail({
  name,
  loginUrl,
  appName = "JaPa",
}: LoginLinkEmailProps) {
  return (
    <Html lang="id">
      <Head />
      <Preview>Tautan login {appName} Anda — berlaku 30 menit</Preview>
      <Tailwind>
        <Body className="bg-zinc-100 font-sans py-8 m-0">
          <Container className="bg-white rounded-xl border border-solid border-zinc-200 overflow-hidden max-w-[480px] mx-auto">
            {/* Header */}
            <Section className="p-8 text-center bg-sky-600 bg-gradient-to-br from-teal-400 to-sky-600">
              <Text className="text-[20px] font-bold text-white tracking-[0.02em] m-0">
                {appName}
              </Text>
            </Section>

            {/* Body */}
            <Section className="p-8">
              <Heading className="m-0 mb-2 text-[20px] text-zinc-900">
                Halo, {name}
              </Heading>
              <Text className="m-0 mb-6 text-[14px] leading-[1.6] text-zinc-600">
                Klik tombol di bawah untuk masuk ke akun {appName} Anda. Tautan ini
                berlaku selama <strong>30 menit</strong> dan hanya bisa digunakan
                satu kali.
              </Text>

              <Section className="text-center mb-6">
                <Button
                  href={loginUrl}
                  className="inline-block px-8 py-[14px] text-[14px] font-semibold text-white no-underline rounded-lg bg-sky-600 bg-gradient-to-br from-teal-400 to-sky-600"
                >
                  Masuk ke {appName}
                </Button>
              </Section>

              <Text className="m-0 mb-4 text-[12px] leading-[1.6] text-zinc-400">
                Jika tombol di atas tidak berfungsi, salin dan tempel tautan
                berikut ke browser Anda:
                <br />
                <Link href={loginUrl} className="text-sky-600 break-all">
                  {loginUrl}
                </Link>
              </Text>

              <Text className="m-0 mb-4 text-[12px] leading-[1.6] text-zinc-400">
                Jika Anda tidak meminta tautan ini, abaikan saja email ini —
                akun Anda tetap aman.
              </Text>
            </Section>

            <Hr className="border-zinc-100 m-0" />

            {/* Footer */}
            <Section className="py-4 px-8 text-center">
              <Text className="m-0 text-[11px] text-zinc-300">
                © {new Date().getFullYear()} JaPa — AI Automated Digital Form Filling Platform.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}