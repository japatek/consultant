'use client'

import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
// Asumsi CardAction di-import dari card Anda. Sesuaikan jika letaknya berbeda.
import { CardAction } from "@/components/ui/card" 

// Registry of FAQ Items (Bilingual: English & Indonesian)
const faqRegistry = [
  {
    value: "api-key-definition",
    trigger: "What is an API Key? | Apa itu API Key?",
    url: "/docs/api/keys",
    content: (
      <div className="space-y-2">
        <p><strong>EN:</strong> An API Key is a unique string of characters used to authenticate and identify the calling application or user making requests to an API. It acts as a secret token to ensure only authorized entities can access the service.</p>
        <p><strong>ID:</strong> API Key adalah serangkaian karakter unik yang digunakan untuk mengautentikasi dan mengidentifikasi aplikasi atau pengguna yang membuat permintaan ke sebuah API. Kunci ini bertindak sebagai token rahasia untuk memastikan hanya entitas berwenang yang dapat mengakses layanan.</p>
      </div>
    ),
  },
  {
    value: "api-key-vs-token",
    trigger: "What is the difference between an API Key and an API Token? | Apa perbedaan API Key dan API Token?",
    url: "/docs/api/tokens",
    content: (
      <div className="space-y-2">
        <p><strong>EN:</strong> While often used interchangeably, an API Key generally identifies the project or application making the call. An API Token (like a Bearer token) is usually generated dynamically, has a limited lifespan, and identifies a specific user session or grants specific scoped permissions.</p>
        <p><strong>ID:</strong> Meskipun sering disamakan, API Key umumnya mengidentifikasi proyek atau aplikasi yang melakukan panggilan. Sebaliknya, API Token biasanya dibuat secara dinamis, memiliki batas waktu kedaluwarsa, dan mengidentifikasi sesi pengguna tertentu atau memberikan izin akses dengan cakupan spesifik.</p>
      </div>
    ),
  },
  {
    value: "get-create-api-credentials",
    trigger: "Where and how can I get or create API Keys and Tokens? | Di mana dan bagaimana saya bisa mendapatkan/membuat API Key & Token?",
    url: "/docs/api/credentials",
    content: (
      <div className="space-y-2">
        <p><strong>EN:</strong> You can create and manage your API Keys and Tokens directly in the &quot;API Settings&quot; or &quot;Developer Dashboard&quot; section of this platform. Simply navigate to the menu, click &quot;Generate New Key&quot;, assign a name or workspace, and save the generated credentials securely.</p>
        <p><strong>ID:</strong> Anda dapat membuat dan mengelola API Key serta Token langsung di bagian &quot;Pengaturan API&quot; atau &quot;Dasbor Pengembang&quot; pada platform ini. Cukup buka menu tersebut, klik &quot;Buat Kunci Baru&quot;, tentukan nama atau ruang kerja (workspace), lalu simpan kredensial yang dihasilkan di tempat yang aman.</p>
      </div>
    ),
  },
  {
    value: "system-prompt-definition",
    trigger: "What is a System Prompt and how does it work? | Apa itu System Prompt dan bagaimana cara kerjanya?",
    url: "/docs/prompts/system",
    content: (
      <div className="space-y-2">
        <p><strong>EN:</strong> A System Prompt is a set of foundational instructions given to an AI model before it interacts with users. It works by setting the context, persona, boundaries, and rules for the AI, guiding how it processes inputs and formats its outputs throughout the conversation.</p>
        <p><strong>ID:</strong> System Prompt adalah serangkaian instruksi dasar yang diberikan kepada model AI sebelum berinteraksi dengan pengguna. Ini bekerja dengan menetapkan konteks, persona, batasan, dan aturan bagi AI, serta memandu bagaimana AI memproses input dan memformat output selama percakapan berlangsung.</p>
      </div>
    ),
  },
  {
    value: "create-system-prompt",
    trigger: "Where and how can I create a System Prompt? | Di mana dan bagaimana cara membuat System Prompt?",
    url: "/docs/prompts/create",
    content: (
      <div className="space-y-2">
        <p><strong>EN:</strong> You can create a System Prompt within the &quot;Agent Configuration&quot; or &quot;Model Settings&quot; panel. Simply type your overarching instructions in the designated &quot;System Instructions&quot; text box before deploying your AI agent.</p>
        <p><strong>ID:</strong> Anda dapat membuat System Prompt di panel &quot;Konfigurasi Agent&quot; atau &quot;Pengaturan Model&quot;. Cukup ketik instruksi utama Anda di dalam kotak teks &quot;Instruksi Sistem&quot; yang disediakan sebelum meluncurkan AI agent Anda.</p>
      </div>
    ),
  },
  {
    value: "agent-definition",
    trigger: "What is an AI Agent? | Apa itu Agent?",
    url: "/docs/agents/overview",
    content: (
      <div className="space-y-2">
        <p><strong>EN:</strong> An AI Agent is an autonomous or semi-autonomous system powered by an AI model. Equipped with a system prompt and specific tools (like web browsing or database access), it can execute multi-step tasks, make decisions, and achieve goals defined by the user.</p>
        <p><strong>ID:</strong> AI Agent adalah sistem otonom atau semi-otonom yang digerakkan oleh model AI. Dilengkapi dengan system prompt dan alat khusus (seperti akses peramban web atau basis data), agent dapat mengeksekusi tugas multi-langkah, mengambil keputusan, dan mencapai tujuan yang ditetapkan oleh pengguna.</p>
      </div>
    ),
  },
  {
    value: "create-agent",
    trigger: "Where and how can I create an Agent? | Di mana dan bagaimana saya bisa membuat Agent?",
    url: "/docs/agents/create",
    content: (
      <div className="space-y-2">
        <p><strong>EN:</strong> Agents can be created in the &quot;Agents&quot; or &quot;Workspace&quot; tab. Click &quot;Create New Agent&quot;, define its name, assign a specific System Prompt, attach the necessary API Keys for external tools, and save the configuration to deploy it.</p>
        <p><strong>ID:</strong> Agent dapat dibuat di tab &quot;Agents&quot; atau &quot;Workspace&quot;. Klik &quot;Buat Agent Baru&quot;, tentukan namanya, tetapkan System Prompt yang spesifik, lampirkan API Key yang diperlukan jika agent menggunakan alat eksternal, lalu simpan konfigurasi untuk meluncurkannya.</p>
      </div>
    ),
  },
];

export function DrawerContent() {
  const router = useRouter(); // Inisialisasi router

  return (
    <div className="flex flex-wrap gap-2 w-full">
      <div className="w-full no-scrollbar overflow-y-auto px-4 pb-8">
        
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Learn more about API authentication, prompts, and AI capabilities.
          </p>
        </div>

        <Accordion
          type="multiple"
          className="w-full max-w-full"
          defaultValue={["api-key-definition"]}
        >
          {faqRegistry.map((item) => (
            <AccordionItem key={item.value} value={item.value} className="border-b border-border/50">
              <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
                {item.trigger}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-2 pb-4 flex flex-col gap-4">
                
                {/* Konten Text/Penjelasan */}
                <div>{item.content}</div>

                {/* Tombol Card Action */}
                <div className="flex justify-end mt-2">
                  <CardAction
                    className="flex items-center gap-1 text-muted-foreground text-sm cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => router.push(item.url)}
                  >
                    Detail <ArrowRight className="size-4" />
                  </CardAction>
                </div>

              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}