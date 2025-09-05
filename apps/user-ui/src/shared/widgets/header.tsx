"use client";

import Link from "next/link";
import React, { useState } from "react";
import { HeartIcon, Search, ShoppingCart, User } from "lucide-react";
import HeaderBottom from "./header-bottom";
import useUser from "../../hooks/useUser";
import axiosInstance from "../../utils/axiosInstance";
import { useStore } from "../../store";

const Header = () => {
  const { user, isLoading } = useUser();
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
    <div className="w-full bg-white">
      <div className="w-[80%] py-5 m-auto flex items-center justify-between">
        <div>
          <Link href={"/"}>
            <span className="text-2xl font-[500]">Zshop</span>
          </Link>
        </div>

        <div className="w-[50%] relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full px-4 font-Poppins font-medium border-[2.5px] border-[#ff4d00] outline-none h-[55px]"
          />
          <div
            onClick={handleSearchClick}
            className="w-[60px] cursor-pointer flex items-center justify-center h-[55px] bg-[#ff4d00] absolute top-0 right-0"
          >
            <Search color="#fff" />
          </div>
        </div>

        {/* suggested dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute w-full top-[60px] bg-white border">
            {suggestions.map((item) => (
              <Link
                href={`/product/${item.slug}`}
                key={item.id}
                onClick={() => {
                  setSuggestions([]);
                  setSearchQuery("");
                }}
                className="block px-4 py-2 text-sm hover:bg-blue-50"
              >
                {item.title}
              </Link>
            ))}
          </div>
        )}

        {loadingSuggestions && (
          <div className="absolute w-full top-[60px] bg-white border">
            searching...
          </div>
        )}

        {/* profile & icons */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            {!isLoading && user ? (
              <>
                <Link
                  href={"/profile"}
                  className="border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full  border-[#010f1c1a]"
                >
                  <User />
                </Link>

                <Link href={"/profile"}>
                  <span className="block font-medium">Hello,</span>

                  <span className="block font-medium">
                    {user?.name?.split(" ")[0]}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={"/login"}
                  className="border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a]"
                >
                  <User />
                </Link>
                <Link href={"/login"}>
                  <span className="block font-medium">Hello,</span>

                  <span className="block font-medium">
                    {isLoading ? "..." : "Sign In"}
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* wishlist and cart */}
          <div className="flex items-center gap-5">
            <Link href={"/wishlist"} className="relative">
              <HeartIcon />
              <div className="w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]">
                <span className="text-white font-medium text-sm">
                  {wishlist?.length}
                </span>
              </div>
            </Link>

            <Link href={"/cart"} className="relative">
              <ShoppingCart />
              <div className="w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]">
                <span className="text-white font-medium text-sm">
                  {cart?.length}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-b-[#99999938]" />

      <HeaderBottom />
    </div>
  );
};

export default Header;
