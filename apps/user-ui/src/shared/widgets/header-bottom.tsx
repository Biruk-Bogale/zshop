"use client";

import {
  AlignLeft,
  ChevronDown,
  ChevronRight,
  HeartIcon,
  ShoppingCart,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { navItems } from "../../configs/constants";
import Link from "next/link";
import useUser from "../../hooks/useUser";
import { useStore } from "../../store";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>();
  const wishlist = useStore((state: any) => state.wishlist);
  const cart = useStore((state: any) => state.cart);

  const { user, isLoading } = useUser();

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product/api/get-categories");

      return res.data;
    },
    staleTime: 1000 * 60 * 30,
  });

  //   Track scroll postion
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`w-full transition-all duration-300 ${
        isSticky
          ? "fixed top-0 left-0 z-[100] bg-white shadow-lg py-2"
          : "shadow-sm relative bg-white border-t border-gray-100"
      }`}
    >
      <div className="max-w-[1400px] w-[90%] m-auto flex items-center justify-between">
        {/* all DropDowns */}
        <div className="relative">
          <div
            className={`w-[260px] cursor-pointer flex items-center justify-between px-6 h-[50px] bg-[#ff4d00] rounded-t-xl ${
              !show && !isSticky ? "rounded-b-xl" : "rounded-b-none"
            } ${
              isSticky && "rounded-xl"
            } transition-all duration-300 hover:bg-[#e04400] shadow-md`}
            onClick={() => setShow(!show)}
          >
            <div className="flex items-center gap-3">
              <AlignLeft color="white" size={20} />
              <span className="text-white font-medium text-base">
                All Departments
              </span>
            </div>
            <ChevronDown
              color="white"
              size={20}
              className={`transition-transform duration-300 ${
                show ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>

          {/* Dropdown menu */}
          <div
            className={`absolute left-0 top-[50px] w-[260px] bg-white shadow-xl rounded-b-xl border-x border-b border-gray-100 transition-all duration-300 origin-top z-50 ${
              show
                ? "opacity-100 scale-y-100 visible"
                : "opacity-0 scale-y-0 invisible"
            }`}
          >
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {data?.categories?.length > 0 ? (
                data.categories.map((cat: string, i: number) => {
                  const hasSub = data.subCategories?.[cat]?.length > 0;
                  const isExpanded = expandedCategory === cat;

                  return (
                    <div key={i} className="relative group/item">
                      <button
                        onClick={() => {
                          if (hasSub) {
                            setExpandedCategory((prev) =>
                              prev === cat ? null : cat
                            );
                          } else {
                            setShow(false);
                            window.location.href = `/products?category=${expandedCategory}/${encodeURIComponent(
                              cat
                            )}`;
                          }
                        }}
                        className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors text-gray-700 hover:text-[#ff4d00]"
                      >
                        <span className="text-sm font-medium">{cat}</span>

                        {hasSub &&
                          (isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:text-[#ff4d00]" />
                          ))}
                      </button>

                      {/* subCategoris panel */}
                      {isExpanded && hasSub && (
                        <div className="bg-gray-50 border-y border-gray-100">
                          {data?.subCategories[cat].map(
                            (sub: string, i: number) => (
                              <Link
                                key={i}
                                href={`products?category=${encodeURIComponent(
                                  cat
                                )}`}
                                className="block px-8 py-2 text-sm text-gray-500 hover:text-[#ff4d00] hover:bg-gray-100 transition-colors"
                                onClick={() => setShow(false)}
                              >
                                {sub}
                              </Link>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="px-5 py-4 text-sm text-gray-500">
                  No Categories found.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item: NavItemsTypes, index: number) => (
            <Link
              className="font-medium text-gray-700 hover:text-[#ff4d00] transition-colors relative group py-2 text-sm uppercase tracking-wide"
              href={item.href}
              key={index}
            >
              {item.title}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#ff4d00] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Sticky Icons */}
        <div className="flex items-center">
          {isSticky && (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                {!isLoading && user ? (
                  <Link
                    href={"/profile"}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 group-hover:border-[#ff4d00] group-hover:text-[#ff4d00] transition-all">
                      <User size={20} />
                    </div>
                  </Link>
                ) : (
                  <Link
                    href={"/login"}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 group-hover:border-[#ff4d00] group-hover:text-[#ff4d00] transition-all">
                      <User size={20} />
                    </div>
                  </Link>
                )}
              </div>

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
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
