import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initialzeSiteConfig = async () => {
  try {
    const existingConfig = await prisma.site_configs.findFirst();

    if (!existingConfig) {
      await prisma.site_configs.create({
        data: {
          categories: [
            "Electronics",
            "Fashion",
            "Home & Kitchen",
            "Sport & Fitness",
          ],
          subCategories: {
            Electronics: ["Mobiles", "Laptops", "Accessories", "Gaming"],
            Fashion: ["Men", "Women", "Kids", "Footwear"],
            "Home & Kitchen": ["Furniture", "Appliances", "Decor"],
            "Sports & Fitness": [
              "Gym Equipment",
              "Outdoor Sports",
              "Wearables",
            ],
          },
          logo: "https://ik.imagekit.io/siisbrnjd/logo/jahshjjas%hna&andkjksdb",
          banner:
            "https://ik.imagekit.io/siisbrnjd/logo/jahshjjas%hna&andkjksdb",
        },
      });
    }
  } catch (error) {
    console.error("Error initializing site config:", error);
  }
};

export default initialzeSiteConfig;
