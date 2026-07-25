import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

const prisma = new PrismaClient();

async function main() {
  const csvFilePath = path.join(process.cwd(), "data", "tools.csv");
  const fileContent = fs.readFileSync(csvFilePath, "utf8");

  const parsed = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  for (const row of parsed.data as any[]) {
    await prisma.tool.upsert({
      where: { slug: row.slug },
      update: {
        name: row.name,
        category: row.category,
        docNo: row.docNo,
        icon: row.icon,
        priceUSD: Number(row.priceUSD),
        priceIDR: Number(row.priceIDR),
        tagline: row.tagline,
        examplePrompt: row.examplePrompt,
        exampleCode: row.exampleCode,
        exampleResult: row.exampleResult,
        how: row.how,
        forWhat: row.forWhat,
        where: row.where,
        whenBuilt: row.whenBuilt,
        why: row.why,
      },
      create: {
        slug: row.slug,
        name: row.name,
        category: row.category,
        docNo: row.docNo,
        icon: row.icon,
        priceUSD: Number(row.priceUSD),
        priceIDR: Number(row.priceIDR),
        tagline: row.tagline,
        examplePrompt: row.examplePrompt,
        exampleCode: row.exampleCode,
        exampleResult: row.exampleResult,
        how: row.how,
        forWhat: row.forWhat,
        where: row.where,
        whenBuilt: row.whenBuilt,
        why: row.why,
      },
    });
  }
  console.log("Database seeded successfully from CSV!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });