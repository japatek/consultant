// Contoh perbaikan di file action.ts Anda
export async function saveArticle(data: any) {
  try {
    // Pisahkan ID dari sisa data agar tidak bentrok
    const { id, ...updateData } = data;

    if (id) {
      // JIKA ID ADA: Lakukan UPDATE
      await prisma.article.update({
        where: { id: id },
        data: updateData,
      });
    } else {
      // JIKA ID KOSONG: Lakukan CREATE
      await prisma.article.create({
        data: updateData,
      });
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}