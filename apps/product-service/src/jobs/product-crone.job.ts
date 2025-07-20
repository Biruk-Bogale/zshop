import prisma from "@packages/libs/primsa";
import cron from "node-cron";

cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();

    // Delete products where `deletedAt` is older than 24 hours
    // const deleteProducts =
    await prisma.products.deleteMany({
      where: {
        isDeleted: true,
        deletedAt: { lte: now },
      },
    });

    // console.log(`${deleteProducts.count} expire products permanently deleted`);
  } catch (error) {
    // console.log(error)
  }
});
