import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// 1. Bungkus inisialisasi Prisma ke dalam sebuah fungsi (Singleton)
const prismaClientSingleton = () => {
  const connectionString = `${process.env.DATABASE_URL}`;
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

// 2. Deklarasikan tipe global menggunakan ReturnType dari fungsi di atas.
// Ini menghindari error "Cannot use namespace 'PrismaClient' as a type" sepenuhnya.
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// 3. Gunakan instance dari global cache, atau buat baru jika belum ada
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// 4. Simpan ke global object hanya saat di mode development untuk mencegah memory leak saat hot-reload
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}