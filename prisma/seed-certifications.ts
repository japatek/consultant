// 1. Suntikkan URL ke environment sebelum Prisma Client dimuat
process.env.DATABASE_URL = 'postgres://3198291bd9db991a8484e4f5ee5e6941b2ca1f77a9227f5a5ca9436afa9b55dc:sk_h67OvH1rlrUxBoq0lJ3iG@db.prisma.io:5432/postgres?sslmode=require';
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
  }
];

async function main() {
  // 2. Gunakan dynamic import agar Prisma mengambil konfigurasi adapter 
  // bawaan aplikasi Anda beserta URL yang baru disuntikkan di atas.
  const { prisma } = await import("../src/lib/database/prisma");

  for (const cert of CERTIFICATIONS) {
    await prisma.certification.upsert({
      where: { slug: cert.slug },
      update: { title: cert.title, description: cert.description },
      create: cert,
    });
  }
  
  console.log(`Seeded ${CERTIFICATIONS.length} certifications.`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});