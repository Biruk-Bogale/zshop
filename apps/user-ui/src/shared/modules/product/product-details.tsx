"use client";

import { sendKafkaEvent } from "apps/user-ui/src/actions/track-user";
import useDeviceTracking from "apps/user-ui/src/hooks/useDeviceTracking";
import useLocationTracking from "apps/user-ui/src/hooks/useLocationTracking";
import useUser from "apps/user-ui/src/hooks/useUser";
import { useStore } from "apps/user-ui/src/store";
import axiosInstance from "apps/user-ui/src/utils/axiosInstance";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  MessageSquareText,
  Package,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  WalletMinimal,
  Star,
  Minus,
  Plus,
  Share2,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ReactImageMagnify from "react-image-magnify";
import Ratings from "../../components/ratings";
import Link from "next/link";
import ProductCard from "../../components/cards/product-card";
import { isProtected } from "apps/user-ui/src/utils/protected";
import { useRouter } from "next/navigation";

const ProductDetails = ({ productDetails }: { productDetails: any }) => {
  const { user, isLoading } = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();
  const [currentImage, setCurrentImage] = useState(
    productDetails?.images[0]?.url
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSelected, setIsSelected] = useState(
    productDetails?.color?.[0] || ""
  );
  const [isSizeSelected, setIsSizeSelected] = useState(
    productDetails?.sizes?.[0] || ""
  );

  const [quantity, setQuantity] = useState(1);
  const [priceRange] = useState([productDetails?.sales_price, 1199]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const addToCart = useStore((state: any) => state.addToCart);
  const cart = useStore((state: any) => state.cart);
  const isInCart = cart.some((item: any) => item?.id === productDetails?.id);
  const addToWishlist = useStore((state: any) => state.addToWishlist);
  const removeFromWishlist = useStore((state: any) => state.removeFromWishlist);
  const wishlist = useStore((state: any) => state.wishlist);
  const isWishlisted = wishlist.some(
    (item: any) => item?.id === productDetails?.id
  );
  const router = useRouter();

  //   navigate to previous image
  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentImage(productDetails?.images[currentIndex - 1]?.url);
    }
  };
  //   navigate to next image
  const nextImage = () => {
    if (currentIndex < productDetails?.images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentImage(productDetails?.images[currentIndex + 1]?.url);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (!location || !deviceInfo || !user?.id) return;
    }

    sendKafkaEvent({
      userId: user?.id,
      productId: productDetails?.id,
      shopId: productDetails?.shopId,
      action: "product_view",
      country: location?.country || "Unknown",
      city: location?.city || "Unknown",
      device: deviceInfo || "Unknown Device",
    });
  }, [location, deviceInfo, isLoading]);

  const fetchFilteredProducts = async () => {
    try {
      const query = new URLSearchParams();

      query.set("priceRange", priceRange.join(","));
      query.set("page", "1");
      query.set("limit", "5");

      const res = await axiosInstance.get(
        `/product/api/get-filtered-products?${query.toString()}`
      );

      setRecommendedProducts(res?.data?.product);
    } catch (error) {
      console.error("Failed to fetch filtered products", error);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [priceRange]);

  const discountPercentage = Math.round(
    ((productDetails?.regular_price - productDetails?.sales_price) /
      productDetails?.regular_price) *
      100
  );

  const handleChat = async () => {
    if (isChatLoading) {
      return;
    }
    setIsChatLoading(true);

    try {
      const res = await axiosInstance.post(
        "/chatting/api/create-user-conversationGroup",
        { sellerId: productDetails?.Shops?.sellerId },
        isProtected
      );

      router.push(`/inbox?conversationId=${res.data.conversation.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      <div className="max-w-[1400px] w-[90%] mx-auto pt-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#ff4d00] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-[#ff4d00] transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[300px]">
            {productDetails?.title}
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[40%_35%_25%] gap-8">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="relative w-full aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
              <ReactImageMagnify
                {...{
                  smallImage: {
                    alt: productDetails?.title || "Product Image",
                    isFluidWidth: true,
                    src:
                      currentImage ||
                      "https://ik.imagekit.io/universityLibrary/products/product-1752739178716_P4vrl_hXs.jpg?tr=e-upscale",
                  },
                  largeImage: {
                    src:
                      currentImage ||
                      "https://ik.imagekit.io/universityLibrary/products/product-1752739178716_P4vrl_hXs.jpg?tr=e-upscale",
                    width: 1800,
                    height: 1800,
                  },
                  enlargedImageContainerDimensions: {
                    width: "120%",
                    height: "120%",
                  },
                  enlargedImageContainerStyle: {
                    zIndex: 50,
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  },
                  isHintEnabled: true,
                  shouldHideHintAfterFirstActivation: false,
                }}
              />
              {productDetails?.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={currentIndex === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={
                      currentIndex === productDetails?.images?.length - 1
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {productDetails?.images?.map((img: any, index: number) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setCurrentImage(img?.url);
                  }}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImage === img?.url
                      ? "border-[#ff4d00] ring-2 ring-[#ff4d00]/20"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={
                      img?.url ||
                      "https://ik.imagekit.io/universityLibrary/products/product-1752739178716_P4vrl_hXs.jpg?tr=e-upscale"
                    }
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Middle Column: Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  {productDetails?.title}
                </h1>
                <button
                  onClick={() => {
                    // Share functionality placeholder
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                >
                  <Share2 size={20} />
                </button>
              </div>

              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Ratings rating={productDetails?.ratings} />
                  <span className="text-sm font-medium text-gray-900 ml-1">
                    {productDetails?.ratings || 0}
                  </span>
                </div>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-sm text-gray-500">
                  {productDetails?.reviews?.length || 0} Reviews
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-sm text-green-600 font-medium">
                  {productDetails?.totalSales || 0} Sold
                </span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-[#ff4d00]">
                  ${productDetails?.sales_price}
                </span>
                {productDetails?.regular_price >
                  productDetails?.sales_price && (
                  <>
                    <span className="text-lg text-gray-400 line-through mb-1">
                      ${productDetails?.regular_price}
                    </span>
                    <span className="mb-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                      -{discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Colors */}
              {productDetails?.colors?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Select Color
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {productDetails?.colors?.map(
                      (color: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setIsSelected(color)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                            isSelected === color
                              ? "border-[#ff4d00] ring-2 ring-[#ff4d00]/20 scale-110"
                              : "border-transparent hover:border-gray-200"
                          }`}
                        >
                          <span
                            className="w-8 h-8 rounded-full border border-black/10 shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {productDetails?.sizes?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Select Size
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {productDetails?.sizes?.map(
                      (size: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setIsSizeSelected(size)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                            isSizeSelected === size
                              ? "bg-gray-900 text-white border-gray-900 shadow-md"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          {size}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Quantity
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                    <button
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-l-lg transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-medium text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-r-lg transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {productDetails?.stock > 0 ? (
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <ShieldCheck size={16} /> {productDetails?.stock} items
                        available
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        Out of Stock
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    addToCart(
                      {
                        ...productDetails,
                        quantity: quantity,
                        selectedOptions: {
                          color: isSelected,
                          size: isSizeSelected,
                        },
                      },
                      user,
                      location,
                      deviceInfo
                    );
                  }}
                  disabled={isInCart || productDetails?.stock === 0}
                  className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-xl font-semibold text-white shadow-lg shadow-orange-500/20 transition-all ${
                    isInCart || productDetails?.stock === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#ff4d00] hover:bg-[#e04400] hover:-translate-y-0.5"
                  }`}
                >
                  <ShoppingBag size={20} />
                  {isInCart
                    ? "Added to Cart"
                    : productDetails?.stock === 0
                    ? "Out of Stock"
                    : "Add to Cart"}
                </button>
                <button
                  onClick={() =>
                    isWishlisted
                      ? removeFromWishlist(
                          productDetails?.id,
                          user,
                          location,
                          deviceInfo
                        )
                      : addToWishlist(
                          {
                            ...productDetails,
                            quantity,
                            selectedOptions: {
                              color: isSelected,
                              size: isSizeSelected,
                            },
                          },
                          user,
                          location,
                          deviceInfo
                        )
                  }
                  className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 transition-all ${
                    isWishlisted
                      ? "border-red-200 bg-red-50 text-red-500"
                      : "border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:text-red-500"
                  }`}
                >
                  <Heart
                    size={24}
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Seller & Delivery */}
          <div className="space-y-6">
            {/* Delivery Info */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Delivery
              </h3>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {location?.city || "Select Location"}, {location?.country}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Delivery Address
                  </p>
                </div>
                <button className="ml-auto text-xs font-medium text-blue-600 hover:underline">
                  CHANGE
                </button>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                  <Truck size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Standard Delivery
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    3 - 5 Days • $5.00
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <WalletMinimal size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Cash on Delivery Available
                  </p>
                </div>
              </div>
            </div>

            {/* Service Info */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Service
              </h3>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                  <Package size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    7 Days Return
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Change of mind is not applicable
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Warranty not available
                  </p>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500">
                  <Store size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sold by</p>
                  <h3 className="text-base font-bold text-gray-900 hover:text-[#ff4d00] transition-colors cursor-pointer">
                    {productDetails?.Shops?.name || "Official Store"}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Rating</p>
                  <p className="text-sm font-bold text-gray-900">88%</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Ship On Time</p>
                  <p className="text-sm font-bold text-gray-900">100%</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Response</p>
                  <p className="text-sm font-bold text-gray-900">95%</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleChat}
                  className="flex-1 flex items-center justify-center gap-2 h-9 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <MessageSquareText size={16} />
                  Chat
                </button>
                <Link
                  href={`/shop/${productDetails?.Shops?.id}`}
                  className="flex-1 flex items-center justify-center gap-2 h-9 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Store size={16} />
                  Visit Store
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description & Reviews */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[75%_25%] gap-8">
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                Product Description
              </h2>
              <div
                className="prose prose-slate max-w-none prose-img:rounded-xl prose-headings:font-bold prose-a:text-[#ff4d00]"
                dangerouslySetInnerHTML={{
                  __html: productDetails?.detailed_description,
                }}
              />
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="reviews">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                Ratings & Reviews
              </h2>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <MessageSquareText className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No reviews yet
                </h3>
                <p className="text-gray-500 mt-1">
                  Be the first to review this product
                </p>
              </div>
            </div>
          </div>
          
          {/* Sidebar Ad or Related (Optional - kept empty for now or could be "You may also like" list) */}
        </div>

        {/* Recommended Products */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {recommendedProducts?.map((i: any, index: number) => (
              <ProductCard key={index} product={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
