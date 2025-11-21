"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Ratings from "../ratings";
import { Heart, MapPin, MessageCircle, ShoppingCart, X } from "lucide-react";
import { useRouter } from "next/navigation";
// import { Span } from "next/dist/trace";
import useUser from "apps/user-ui/src/hooks/useUser";
import useLocationTracking from "apps/user-ui/src/hooks/useLocationTracking";
import useDeviceTracking from "apps/user-ui/src/hooks/useDeviceTracking";
import { useStore } from "apps/user-ui/src/store";
import axiosInstance from "apps/user-ui/src/utils/axiosInstance";
import { isProtected } from "apps/user-ui/src/utils/protected";

const ProductDetailsCard = ({
  data,
  setOpen,
}: {
  data: any;
  setOpen: (open: boolean) => void;
}) => {
  const [activeImage, setAtiveImage] = useState(0);
  const [isSelected, setIsSelected] = useState(data?.color?.[0] || "");
  const [isSizeSelected, setIsSizeSelected] = useState(data?.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { user } = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();

  const addToCart = useStore((state: any) => state.addToCart);
  // const removeFromCart = useStore((state: any) => state.removeFromCart);

  const addToWishlist = useStore((state: any) => state.addToWishlist);
  const removeFromWishlist = useStore((state: any) => state.removeFromWishlist);

  const wishlist = useStore((state: any) => state.wishlist);
  const isWishlisted = wishlist.some((item: any) => item?.id === data?.id);

  const cart = useStore((state: any) => state.cart);
  const isInCart = cart.some((item: any) => item?.id === data?.id);

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const handleChat = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    try {
      const res = await axiosInstance.post(
        "/chatting/api/create-user-conversationGroup",
        { sellerId: data?.Shops?.sellerId },
        isProtected
      );

      router.push(`/inbox?conversationId=${res.data.conversation.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white text-gray-500 hover:text-red-500 transition-all shadow-sm border border-gray-100"
          onClick={() => setOpen(false)}
        >
          <X size={24} />
        </button>

        {/* Left Column: Image Gallery */}
        <div className="w-full md:w-1/2 bg-gray-50 p-6 md:p-10 flex flex-col items-center justify-center relative">
          <div className="relative w-full aspect-square max-w-[500px] mix-blend-multiply">
            <Image
              src={data?.images?.[activeImage]?.url}
              alt={data?.title}
              fill
              className="object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-8 overflow-x-auto pb-2 w-full justify-center px-4">
            {data?.images?.map?.((img: any, index: number) => (
              <div
                key={index}
                className={`relative flex-shrink-0 w-16 h-16 cursor-pointer rounded-lg border-2 transition-all duration-200 overflow-hidden ${
                  activeImage === index
                    ? "border-[#ff4d00] shadow-md scale-105"
                    : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"
                }`}
                onClick={() => setAtiveImage(index)}
              >
                <Image
                  src={img?.url}
                  alt={`Thumbnail ${index}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto custom-scrollbar bg-white">
          {/* Seller Info */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src={
                    data?.Shops?.avatar ||
                    "https://fairpay3.birukdev.com/assets/logo-CDo5lahR.png"
                  }
                  alt="shop logo"
                  width={50}
                  height={50}
                  className="rounded-full w-12 h-12 object-cover border border-gray-200 shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <Link
                  href={`/shop/${data?.Shops?.id}`}
                  className="text-base font-semibold text-gray-900 hover:text-[#ff4d00] transition-colors"
                >
                  {data?.Shops?.name}
                </Link>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <Ratings rating={data?.ratings || 0} />
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {data?.Shops?.address || "Global"}
                  </span>
                </div>
              </div>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium rounded-full text-sm transition-colors"
              onClick={() => handleChat()}
            >
              <MessageCircle size={16} />
              <span className="hidden sm:inline">Chat</span>
            </button>
          </div>

          {/* Product Title & Description */}
          <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
            {data?.title}
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded text-xs font-medium uppercase tracking-wide">
              {data?.category || "General"}
            </span>
            {data?.stock > 0 ? (
              <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                In Stock
              </span>
            ) : (
              <span className="text-red-600 text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                Out of Stock
              </span>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
            {data?.short_description || data?.description}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-4 mb-8">
            <h3 className="text-4xl font-bold text-[#ff4d00]">
              ${data?.sales_price}
            </h3>
            {data?.regular_price && (
              <>
                <h3 className="text-xl text-gray-400 line-through decoration-1">
                  ${data?.regular_price}
                </h3>
                <span className="bg-red-50 text-red-600 px-2 py-1 rounded-md text-xs font-bold">
                  -
                  {Math.round(
                    ((data.regular_price - data.sales_price) /
                      data.regular_price) *
                      100
                  )}
                  % OFF
                </span>
              </>
            )}
          </div>

          {/* Options: Color & Size */}
          <div className="space-y-6 mb-8">
            {data?.colors?.length > 0 && (
              <div>
                <span className="block text-sm font-semibold text-gray-900 mb-3">
                  Select Color: <span className="text-gray-500 font-normal">{isSelected}</span>
                </span>
                <div className="flex flex-wrap gap-3">
                  {data?.colors?.map((color: string, index: number) => (
                    <button
                      key={index}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 relative ${
                        isSelected === color
                          ? "border-[#ff4d00] scale-110 shadow-sm"
                          : "border-transparent hover:scale-105"
                      }`}
                      onClick={() => setIsSelected(color)}
                    >
                      <span
                        className="absolute inset-1 rounded-full shadow-inner"
                        style={{ backgroundColor: color }}
                      ></span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {data?.sizes?.length > 0 && (
              <div>
                <span className="block text-sm font-semibold text-gray-900 mb-3">
                  Select Size: <span className="text-gray-500 font-normal">{isSizeSelected}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {data?.sizes?.map((size: string, index: number) => (
                    <button
                      key={index}
                      className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                        isSizeSelected === size
                          ? "bg-gray-900 text-white border-gray-900 shadow-md"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                      onClick={() => setIsSizeSelected(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
            {/* Quantity */}
            <div className="flex items-center border border-gray-200 rounded-full h-12 w-max px-2 bg-gray-50">
              <button
                className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black font-bold text-lg transition-colors"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span className="w-8 text-center font-semibold text-gray-900">
                {quantity}
              </span>
              <button
                className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black font-bold text-lg transition-colors"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              className={`flex-1 h-12 flex items-center justify-center gap-2 bg-[#ff4d00] hover:bg-[#e04400] text-white font-semibold rounded-full shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 ${
                isInCart ? "opacity-75 cursor-not-allowed" : ""
              }`}
              disabled={isInCart}
              onClick={() =>
                !isInCart &&
                addToCart(
                  { ...data, quantity: 1 },
                  user,
                  location,
                  deviceInfo
                )
              }
            >
              <ShoppingCart size={20} />
              {isInCart ? "Added to Cart" : "Add to Cart"}
            </button>

            {/* Wishlist */}
            <button
              className={`h-12 w-12 flex items-center justify-center rounded-full border transition-all ${
                isWishlisted
                  ? "bg-red-50 border-red-100 text-red-500"
                  : "bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500"
              }`}
              onClick={() => {
                isWishlisted
                  ? removeFromWishlist(data.id, user, location, deviceInfo)
                  : addToWishlist(
                      { ...data, quantity: 1 },
                      user,
                      location,
                      deviceInfo
                    );
              }}
            >
              <Heart
                size={22}
                fill={isWishlisted ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Delivery Info */}
          <div className="mt-8 flex items-center gap-3 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
            <div className="p-2 bg-white rounded-full shadow-sm">
              <ShoppingCart size={16} className="text-[#ff4d00]" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Free Delivery & Returns</p>
              <p>Estimated delivery by <span className="font-semibold text-gray-700">{estimatedDelivery.toDateString()}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
