"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Ratings from "../ratings";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import ProductDetailsCard from "./product-details.card";
import { useStore } from "apps/user-ui/src/store";
import useUser from "apps/user-ui/src/hooks/useUser";
import useLocationTracking from "apps/user-ui/src/hooks/useLocationTracking";
import useDeviceTracking from "apps/user-ui/src/hooks/useDeviceTracking";

const ProductCard = ({
  isEvent,
  product,
}: {
  product: any;
  isEvent?: boolean;
}) => {
  console.log(product);
  const [timeLeft, setTimeLeft] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();

  const addToCart = useStore((state: any) => state.addToCart);
  // const removeFromCart = useStore((state: any) => state.removeFromCart);

  const addToWishlist = useStore((state: any) => state.addToWishlist);
  const removeFromWishlist = useStore((state: any) => state.removeFromWishlist);

  const wishlist = useStore((state: any) => state.wishlist);
  const isWishlisted = wishlist.some((item: any) => item?.id === product?.id);

  const cart = useStore((state: any) => state.cart);
  const isInCart = cart.some((item: any) => item?.id === product?.id);

  useEffect(() => {
    if (isEvent && product?.ending_date) {
      const interval = setInterval(() => {
        const endTime = new Date(product.ending_date).getTime();
        const now = Date.now();
        const diff = endTime - now;

        if (diff <= 0) {
          setTimeLeft("Expired");
          clearInterval(interval);
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60) / 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m left with this price`);
      }, 60000);

      return () => clearInterval(interval);
    }
    return;
  }, [isEvent, product?.ending_date]);

  return (
    <>
      <div className="group w-full bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {isEvent && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
              OFFER
            </span>
          )}
          {product?.stock <= 5 && (
            <span className="bg-amber-400 text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
              LOW STOCK
            </span>
          )}
        </div>

        {/* Image Section */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
          <Link href={`/product/${product?.slug}`}>
            <img
              src={
                product?.images[0]?.url ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqnpxGd5RcjGGC2EgxS0gjw2J7MnTdnUAG61FusQxNYNnhdcLbSwK1Lw&s"
              }
              alt={product?.title}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
            />
          </Link>

          {/* Hover Actions Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              onClick={() =>
                isWishlisted
                  ? removeFromWishlist(product.id, user, location, deviceInfo)
                  : addToWishlist(
                      { ...product, quantity: 1 },
                      user,
                      location,
                      deviceInfo
                    )
              }
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-110 ${
                isWishlisted
                  ? "bg-white text-red-500"
                  : "bg-white text-gray-700 hover:text-red-500"
              }`}
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart
                size={20}
                fill={isWishlisted ? "currentColor" : "none"}
                strokeWidth={2}
              />
            </button>

            <button
              onClick={() => setOpen(true)}
              className="w-10 h-10 bg-white text-gray-700 rounded-full flex items-center justify-center shadow-lg hover:text-[#ff4d00] hover:scale-110 transition-all"
              title="Quick View"
            >
              <Eye size={20} strokeWidth={2} />
            </button>

            <button
              onClick={() =>
                !isInCart &&
                addToCart(
                  { ...product, quantity: 1 },
                  user,
                  location,
                  deviceInfo
                )
              }
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-110 ${
                isInCart
                  ? "bg-[#ff4d00] text-white"
                  : "bg-white text-gray-700 hover:text-[#ff4d00]"
              }`}
              title="Add to Cart"
            >
              <ShoppingBag size={20} strokeWidth={2} />
            </button>
          </div>

          {/* Timer Overlay for Events */}
          {isEvent && timeLeft && (
            <div className="absolute bottom-0 left-0 right-0 bg-[#ff4d00]/90 text-white text-xs font-medium py-1 text-center backdrop-blur-sm">
              {timeLeft}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          <Link
            href={`/shop/${product?.Shops?.id}`}
            className="text-xs text-gray-500 hover:text-[#ff4d00] transition-colors mb-1 block"
          >
            {product?.Shops?.name}
          </Link>

          <Link
            href={`/product/${product?.slug}`}
            className="block text-sm font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-[#ff4d00] transition-colors min-h-[40px]"
          >
            {product?.title}
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <Ratings rating={product?.ratings} />
            <span className="text-xs text-gray-400">
              ({product?.reviews?.length || 0})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#ff4d00]">
                  ${product?.sales_price}
                </span>
                {product?.regular_price > product?.sales_price && (
                  <span className="text-xs text-gray-400 line-through">
                    ${product?.regular_price}
                  </span>
                )}
              </div>
            </div>
            <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
              {product?.totalSales || 0} sold
            </div>
          </div>
        </div>
      </div>

      {open && <ProductDetailsCard data={product} setOpen={setOpen} />}
    </>
  );
};

export default ProductCard;
