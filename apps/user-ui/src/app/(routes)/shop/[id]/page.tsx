import SellerProfile from "apps/user-ui/src/shared/modules/seller/seller-profile";
import axiosInstance from "apps/user-ui/src/utils/axiosInstance";
import { Metadata } from "next";
import React from "react";

async function fetchSellerDetails(id: string) {
  try {
    const res = await axiosInstance.get(`/seller/api/get-seller/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

// generate metadata generator
export async function generateMetadata({ params }: { params: { id: string } }):Promise<Metadata> {
  const data = await fetchSellerDetails(params.id);

  return {
    title: `${data?.shop?.name} | Zshop Marketplace`,
    description:
      data?.shop?.bio ||
      "Explore products and services from trusted seller on Eshop.",
    openGraph: {
      title: `${data?.shop?.name} | Zshop Marketplace`,
      description:
        data?.shop?.bio ||
        "Explore products and services from trusted seller on Eshop.",
      type: "website",
      images: [
        {
          url:
            data?.shop?.avatar ||
            "https://ik.imagekit.io/universityLibrary/products/product-1752739178716_P4vrl_hXs.jpg?tr=e-upscale",
          width: 800,
          height: 600,
          alt: data?.shop?.name || "Shop Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data?.shop?.name} | Zshop Marketplace`,
      description:
        data?.shop?.bio ||
        "Explore products and services from trusted seller on Eshop.",
      images: [
        data?.shop?.avatar ||
          "https://ik.imagekit.io/universityLibrary/products/product-1752739178716_P4vrl_hXs.jpg?tr=e-upscale",
      ],
    },
  };
}

const Page = async ({ params }: { params: { id: string } }) => {
  const data = await fetchSellerDetails(params.id);

  return (
    <div>
      <SellerProfile shop={data?.shop} followersCount={data?.followersCount} />
    </div>
  );
};

export default Page;
