/**
 * Seeds the two certification families described in the brief. Run once
 * (e.g. `npx tsx prisma/seed-certifications.ts`) after migrating — the
 * Quest Builder's certification multi-select reads from this table, so it
 * needs at least these rows to have anything to show.
 *
 * Uses your existing Prisma client singleton import path — adjust if yours
 * lives somewhere else.
 */
import { prisma } from "../src/lib/database/prisma";

const CERTIFICATIONS = [
  {
    slug: "associate-drawing-inspector",
    title: "Associate Drawing Inspector",
    description:
      "Foundational certification covering how to read and interpret engineering drawings against ISO, ASME, and other major drawing standards.",
  },
  {
    slug: "drawing-inspector-welding",
    title: "Drawing Inspector — Welding Annotation",
    description: "Specialist certification in reading and verifying welding symbols and annotations on drawings.",
  },
  {
    slug: "drawing-inspector-pid",
    title: "Drawing Inspector — P&ID",
    description: "Specialist certification in reading and verifying Piping & Instrumentation Diagrams (P&ID).",
  },
  {
    slug: "drawing-inspector-sheet-metal",
    title: "Drawing Inspector — Sheet Metal",
    description: "Specialist certification in reading and verifying sheet metal fabrication drawings.",
  },
  {
    slug: "drawing-inspector-architectural",
    title: "Drawing Inspector — Architectural Drawing",
    description: "Specialist certification in reading and verifying architectural drawings.",
  },
];

async function main() {
  for (const cert of CERTIFICATIONS) {
    await prisma.certification.upsert({
      where: { slug: cert.slug },
      update: { title: cert.title, description: cert.description },
      create: cert,
    });
  }
  console.log(`Seeded ${CERTIFICATIONS.length} certifications.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
