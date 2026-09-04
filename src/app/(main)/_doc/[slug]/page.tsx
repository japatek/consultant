// app/docs/[slug]/page.tsx

import { notFound } from "next/navigation"
import { Metadata } from "next"

// 1. Define the Types for the URL parameters
type DocPageProps = {
  params: Promise<{
    slug: string
  }>
}

// 2. Create a mock "database" of your content
// In a real app, this might fetch from a database, CMS, or .mdx files
const docContent: Record<string, { title: string; description: string; body: React.ReactNode }> = {
  quickstart: {
    title: "Quickstart",
    description: "Learn how to get started in under 5 minutes.",
    body: (
      <>
        <h2 id="installation" className="text-2xl font-semibold tracking-tight mt-10 mb-4 pb-2 border-b">
          Installation
        </h2>
        <p>Run <code>npm install @my-org/core-sdk</code> to begin.</p>
      </>
    ),
  },
  models: {
    title: "Models",
    description: "Configure and switch between AI models.",
    body: (
      <>
        <h2 id="supported-models" className="text-2xl font-semibold tracking-tight mt-10 mb-4 pb-2 border-b">
          Supported Models
        </h2>
        <p>We support OpenAI, Anthropic, and Llama 3.</p>
      </>
    ),
  },
  tools: {
    title: "Tools",
    description: "Give your AI agents access to external tools.",
    body: (
      <>
        <h2 id="creating-tools" className="text-2xl font-semibold tracking-tight mt-10 mb-4 pb-2 border-b">
          Creating Tools
        </h2>
        <p>Use the <code>createTool()</code> function to connect external APIs.</p>
      </>
    ),
  },
}

// 3. Dynamically generate the <title> metadata for SEO based on the slug
export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const doc = docContent[resolvedParams.slug]

  if (!doc) {
    return { title: "Page Not Found" }
  }

  return {
    title: `${doc.title} | My Documentation`,
    description: doc.description,
  }
}

// 4. The Main Page Component
export default async function DynamicDocPage({ params }: DocPageProps) {
  // Await the params (Required in Next.js 15+)
  const resolvedParams = await params
  
  // Look up the content using the URL slug
  const doc = docContent[resolvedParams.slug]

  // If the user types a URL that doesn't exist (e.g., /docs/fake-page), return a 404
  if (!doc) {
    notFound()
  }

  return (
    <article className="max-w-none prose prose-slate dark:prose-invert">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight scroll-m-20">
          {doc.title}
        </h1>
        <p className="text-lg text-muted-foreground">
          {doc.description}
        </p>
      </div>

      {/* Render the specific content for this page */}
      {doc.body}
      
    </article>
  )
}