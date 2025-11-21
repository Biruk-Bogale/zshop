"use client";

import { useQuery } from "@tanstack/react-query";
import ProductCard from "apps/user-ui/src/shared/components/cards/product-card";
import axiosInstance from "apps/user-ui/src/utils/axiosInstance";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Range } from "react-range";

const MIN = 0;
const MAX = 1199;

const Page = () => {
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 1199]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [tempPriceRange, setTempPriceRange] = useState([0, 1199]);
  const router = useRouter();

  const colors = [
    { name: "Black", code: "#000" },
    { name: "Red", code: "#ff0000" },
    { name: "Green", code: "#00ff00" },
    { name: "Blue", code: "#0000ff" },
    { name: "Yellow", code: "#ffff00" },
    { name: "Magenta", code: "#ff00ff" },
    { name: "Cyan", code: "#00ffff" },
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const updateURL = () => {
    const params = new URLSearchParams();
    params.set("priceRange", priceRange.join(","));
    if (selectedCategories.length > 0)
      params.set("categories", selectedCategories.join(","));

    if (selectedColors.length > 0)
      params.set("colors", selectedColors.join(","));

    if (selectedSizes.length > 0) params.set("sizes", selectedSizes.join(","));

    params.set("page", page.toString());

    router.replace(`/products?${decodeURIComponent(params.toString())}`);
  };

  const fetchFilteredProducts = async () => {
    setIsProductLoading(true);

    try {
      const query = new URLSearchParams();

      query.set("priceRange", priceRange.join(","));

      if (selectedCategories.length > 0) {
        query.set("categories", selectedCategories.join(","));
      }

      if (selectedColors.length > 0) {
        query.set("colors", selectedColors.join(","));
      }

      if (selectedSizes.length > 0) {
        query.set("sizes", selectedSizes.join(","));
      }

      query.set("page", page.toString());
      query.set("limit", "12");

      const res = await axiosInstance.get(
        `/product/api/get-filtered-products?${query.toString()}`
      );

      setProducts(res.data.product);
      setTotalPages(res.data?.paginations?.totalPages);
    } catch (error) {
      console.error("Failed to fetch filtered products", error);
    } finally {
      setIsProductLoading(false);
    }
  };

  useEffect(() => {
    updateURL();

    fetchFilteredProducts();
  }, [
    priceRange,
    selectedCategories,
    selectedSizes,
    selectedColors,
    selectedColors,
    page,
  ]);

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product/api/get-categories");

      return res.data;
    },
    staleTime: 1000 * 60 * 30,
  });

  const toggleCategory = (label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label)
        ? prev.filter((cat) => cat !== label)
        : [...prev, label]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      <div className="max-w-[1400px] w-[90%] m-auto pt-8">
        {/* Header & Breadcrumbs */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-Poppins">
            All Products
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href={"/"} className="hover:text-[#ff4d00] transition-colors">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Products</span>
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-[280px] shrink-0 space-y-8">
            <div className="lg:sticky lg:top-24 space-y-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              {/* Price Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-Poppins">
                  Price Range
                </h3>
                <div className="px-2">
                  <Range
                    step={1}
                    min={MIN}
                    max={MAX}
                    values={tempPriceRange}
                    onChange={(values) => setTempPriceRange(values)}
                    renderTrack={({ props, children }) => {
                      const [min, max] = tempPriceRange;
                      const percentageLeft = ((min - MIN) / (MAX - MIN)) * 100;
                      const percentageRight = ((max - MIN) / (MAX - MIN)) * 100;

                      return (
                        <div
                          {...props}
                          className="h-1.5 bg-gray-200 rounded-full relative"
                          style={{ ...props.style }}
                        >
                          <div
                            className="absolute h-full bg-[#ff4d00] rounded-full"
                            style={{
                              left: `${percentageLeft}%`,
                              width: `${percentageRight - percentageLeft}%`,
                            }}
                          />
                          {children}
                        </div>
                      );
                    }}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        className="w-5 h-5 bg-white border-2 border-[#ff4d00] rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#ff4d00]/20"
                      />
                    )}
                  />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-md border border-gray-200">
                    ${tempPriceRange[0]} - ${tempPriceRange[1]}
                  </div>
                  <button
                    onClick={() => {
                      setPriceRange(tempPriceRange);
                      setPage(1);
                    }}
                    className="text-xs font-semibold px-4 py-1.5 bg-gray-900 text-white rounded-md hover:bg-[#ff4d00] transition-colors"
                  >
                    APPLY
                  </button>
                </div>
              </div>

              <div className="h-[1px] bg-gray-100" />

              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-Poppins">
                  Categories
                </h3>
                <ul className="space-y-2.5">
                  {isLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-5 bg-gray-100 rounded animate-pulse w-3/4"
                        ></div>
                      ))}
                    </div>
                  ) : (
                    data?.categories?.map((category: any) => (
                      <li key={category}>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category)}
                              onChange={() => toggleCategory(category)}
                              className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:border-[#ff4d00] checked:bg-[#ff4d00]"
                            />
                            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                          <span className="text-sm text-gray-600 group-hover:text-[#ff4d00] transition-colors">
                            {category}
                          </span>
                        </label>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div className="h-[1px] bg-gray-100" />

              {/* Colors */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-Poppins">
                  Colors
                </h3>
                <div className="flex flex-wrap gap-3">
                  {colors?.map((color: any) => (
                    <button
                      key={color.name}
                      onClick={() => toggleColor(color.name)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedColors.includes(color.name)
                          ? "border-[#ff4d00] scale-110"
                          : "border-transparent hover:border-gray-300"
                      }`}
                      title={color.name}
                    >
                      <span
                        className="w-6 h-6 rounded-full border border-gray-100 shadow-sm"
                        style={{ backgroundColor: color.code }}
                      ></span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[1px] bg-gray-100" />

              {/* Sizes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-Poppins">
                  Sizes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sizes?.map((size: any) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                        selectedSizes.includes(size)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isProductLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
                  >
                    <div className="h-[200px] bg-gray-100 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                      <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
                      <div className="flex justify-between pt-2">
                        <div className="h-6 bg-gray-100 rounded w-1/3 animate-pulse" />
                        <div className="h-8 w-8 bg-gray-100 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products?.map((product) => (
                  <ProductCard key={product?.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  No products found
                </h3>
                <p className="text-gray-500 mt-1">
                  Try adjusting your filters or search criteria.
                </p>
                <button
                  onClick={() => {
                    setPriceRange([MIN, MAX]);
                    setTempPriceRange([MIN, MAX]);
                    setSelectedCategories([]);
                    setSelectedColors([]);
                    setSelectedSizes([]);
                    setPage(1);
                  }}
                  className="mt-6 px-6 py-2 bg-[#ff4d00] text-white rounded-full font-medium hover:bg-[#e04400] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all ${
                      page === i + 1
                        ? "bg-[#ff4d00] text-white shadow-md shadow-orange-500/20"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-[#ff4d00] hover:text-[#ff4d00]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
