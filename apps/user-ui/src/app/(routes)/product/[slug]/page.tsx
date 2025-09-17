import ProductDetails from "apps/user-ui/src/shared/modules/product/product-details";
import axiosInstance from "apps/user-ui/src/utils/axiosInstance";
import { Metadata } from "next";
import React from "react";

async function fetchProductDetails(slug: string) {
  try {
    const response = await axiosInstance.get(
      `/product/api/get-product/${slug}`
    );
    return response.data.product;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null; // prevent crashing page
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params; // ⬅️ await here
  const product = await fetchProductDetails(slug);

  return {
    title: `${product?.title} | Zialem Marketplace`,
    description:
      product?.short_description ||
      "Discover high-quality products on Zialem Marketplace",
    openGraph: {
      title: product?.title,
      description: product?.short_description || "",
      images: [product?.images?.[0]?.url || "/default-image.jpg"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product?.title,
      description: product?.short_description || "",
      images: [product?.images?.[0]?.url || "/default-image.jpg"],
    },
  };
}

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params; // ⬅️ await here

  const productDetails = await fetchProductDetails(slug);

  return <ProductDetails productDetails={productDetails} />;
};

export default Page;
