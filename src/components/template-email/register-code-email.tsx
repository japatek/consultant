// emails/RegisterCodeEmail.tsx

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
// ✅ REMOVED lucide-react import

interface RegisterCodeEmailProps {
  code: string;
  expiryLabel?: string;
  appName?: string;
}

export default function RegisterCodeEmail({
  code,
  expiryLabel = "15 minutes",
  appName = 'JaPa'
}: RegisterCodeEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>JaPa verification code: {code}</Preview>

      <Tailwind>
        <Body className="bg-zinc-100 font-sans m-0 py-10">
          <Container className="bg-white border border-solid border-zinc-200 rounded-2xl mx-auto max-w-[520px] overflow-hidden">
            {/* Header */}
            <Section className="p-8 text-center bg-sky-600 bg-gradient-to-br from-teal-400 to-sky-600">
              <Text className="text-[20px] font-bold text-white tracking-[0.02em] m-0">
                {appName}
              </Text>
            </Section>

            {/* Body */}
            <Section className="pt-8 px-8 pb-7">
              <Heading className="text-zinc-900 text-[22px] font-extrabold tracking-[-0.3px] m-0 mb-4 text-center">
                Verification Code
              </Heading>

              <Text className="text-zinc-600 text-[14px] leading-[1.7] m-0 mb-6 text-center">
                Here is the code to verify your{" "}
                <strong className="text-royal-blue">{appName}</strong> account. Please enter
                this code on the website to proceed.
              </Text>

              {/* The big code box */}
              <Section className="bg-zinc-100 border border-solid border-zinc-900/25 rounded-xl py-5 px-6 m-0 mb-5 text-center">
                <Text className="text-royal-blue text-[36px] font-extrabold tracking-[8px] m-0 font-mono">
                  {code}
                </Text>
              </Section>

              <Text className="text-zinc-600 text-[13px] leading-[1.6] m-0 text-center">
                This code is valid for{" "}
                <strong className="text-royal-blue">{expiryLabel}</strong>.
                Do not share this code with anyone.
              </Text>
            </Section>

            <Hr className="border-zinc-900 m-0" />

            {/* Footer */}
            <Section className="py-5 px-8">
              <Text className="text-destructive text-[12px] m-0 mb-1 text-center">
                If you did not request this code, please ignore this email — no
                changes will be made.
              </Text>
              <Text className="text-zinc-900 text-[12px] m-0 mb-1 text-center">
                {/* ✅ Safely swapped <Copyright /> out for standard text copyright character */}
                © {new Date().getFullYear()} JaPa — AI Automated Digital Form Filling Platform.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

RegisterCodeEmail.PreviewProps = {
  code: "482917",
} satisfies RegisterCodeEmailProps;