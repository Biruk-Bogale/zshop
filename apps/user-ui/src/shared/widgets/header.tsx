"use client";

import Link from "next/link";
import React, { useState } from "react";
import { HeartIcon, Search, ShoppingCart, User } from "lucide-react";
import HeaderBottom from "./header-bottom";
import useUser from "../../hooks/useUser";
import axiosInstance from "../../utils/axiosInstance";
import { useStore } from "../../store";
import useLayout from "../../hooks/useLayout";
import Image from "next/image";

const Header = () => {
  const { user, isLoading } = useUser();
  const { layout } = useLayout();
  const wishlist = useStore((state: any) => state.wishlist);
  const cart = useStore((state: any) => state.cart);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleSearchClick = async () => {
    if (!searchQuery.trim()) return;
    setLoadingSuggestions(true);

    try {
      const res = await axiosInstance.get(
        `/product/api/search-products?q=${encodeURIComponent(searchQuery)}`
      );

      setSuggestions(res.data.products.slice(0, 10));
    } catch (err) {
    } finally {
      setLoadingSuggestions(false);
    }
  };

  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[1400px] w-[90%] py-4 m-auto flex items-center justify-between gap-5">
        <div className="shrink-0">
          <Link href={"/"} className="flex items-center gap-1">
            <Image
              src={
                layout?.logo ||
                "https://ik.imagekit.io/universityLibrary/products/product-1752739178716_P4vrl_hXs.jpg?tr=e-upscale"
              }
              alt=""
              width={300}
              height={100}
              className="h-[50px] object-contain z-0"
            />
            <span className="text-3xl absolute left-64 top-5 font-bold text-[#ff4d00] tracking-tight z-10">
              shop
            </span>
            <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">
              Multi-Vendor
            </span>
          </Link>
        </div>

        <div className="flex-1 max-w-[700px] relative">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands and more..."
              className="w-full px-6 py-3 rounded-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/10 outline-none transition-all duration-300 font-Poppins text-sm"
            />
            <button
              onClick={handleSearchClick}
              className="absolute right-1.5 top-1.5 bottom-1.5 w-[45px] flex items-center justify-center bg-[#ff4d00] hover:bg-[#e04400] rounded-full transition-colors shadow-md"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* suggested dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-[60]">
              {suggestions.map((item) => (
                <Link
                  href={`/product/${item.slug}`}
                  key={item.id}
                  onClick={() => {
                    setSuggestions([]);
                    setSearchQuery("");
                  }}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none group"
                >
                  <Search className="w-4 h-4 text-gray-400 group-hover:text-[#ff4d00]" />
                  <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {loadingSuggestions && (
            <div className="absolute w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 text-center text-sm text-gray-500">
              Searching...
            </div>
          )}
        </div>

        {/* profile & icons */}
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-3">
            {!isLoading && user ? (
              <Link href={"/profile"} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 group-hover:border-[#ff4d00] group-hover:text-[#ff4d00] transition-all">
                  <User size={20} />
                </div>
                <div className="hidden xl:block">
                  <span className="block text-xs text-gray-500 font-medium">
                    Hello,
                  </span>
                  <span className="block text-sm font-semibold text-gray-800 group-hover:text-[#ff4d00] transition-colors">
                    {user?.name?.split(" ")[0]}
                  </span>
                </div>
              </Link>
            ) : (
              <Link href={"/login"} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 group-hover:border-[#ff4d00] group-hover:text-[#ff4d00] transition-all">
                  <User size={20} />
                </div>
                <div className="hidden xl:block">
                  <span className="block text-xs text-gray-500 font-medium">
                    Welcome
                  </span>
                  <span className="block text-sm font-semibold text-gray-800 group-hover:text-[#ff4d00] transition-colors">
                    Sign In / Join
                  </span>
                </div>
              </Link>
            )}
          </div>

          <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>

          {/* wishlist and cart */}
          <div className="flex items-center gap-4">
            <Link href={"/wishlist"} className="relative group">
              <div className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <HeartIcon className="w-6 h-6 text-gray-600 group-hover:text-[#ff4d00] transition-colors" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff4d00] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <span className="text-white font-bold text-[10px]">
                  {wishlist?.length || 0}
                </span>
              </div>
            </Link>

            <Link href={"/cart"} className="relative group">
              <div className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-[#ff4d00] transition-colors" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff4d00] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <span className="text-white font-bold text-[10px]">
                  {cart?.length || 0}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-100" />

      <HeaderBottom />
    </div>
  );
};

export default Header;
