"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { RiArrowLeftLine, RiSearchLine, RiCloseLine } from "react-icons/ri";
import { useVendors } from "@/hooks/vendor/useVendors";
import { useBusinessCategories } from "@/hooks/category/useBusinessCategories";
import BottomNavigation from "@/components/home/BottomNavigation";

function SearchContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("categoryId") || "";
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch vendors in this category
    const { data: vendorsResponse, isLoading } = useVendors(categoryId);
    const { data: categoriesResponse } = useBusinessCategories();

    const vendors = vendorsResponse?.data || [];
    const categories = categoriesResponse?.data || [];
    const currentCategory = categories.find((cat) => cat.id === categoryId);
    const categoryName = currentCategory?.name || "Restaurants";

    // Auto-focus search input
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Filter vendors
    const filteredVendors = vendors.filter((vendor) =>
        vendor.business_name.toLowerCase().includes(search.toLowerCase())
    );

    const popularTags = ["Biryani", "Pizza", "Momo", "Burger", "Thali", "Rolls", "Desserts"];

    return (
        <main className="mx-auto min-h-screen max-w-3xl bg-white pb-24 text-left">
            {/* SEARCH HEADER */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100 p-4 flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="inline-flex justify-center items-center bg-gray-100 hover:bg-gray-200 w-9 h-9 rounded-full transition cursor-pointer"
                    aria-label="Go back"
                >
                    <RiArrowLeftLine className="text-gray-700" size={20} />
                </button>

                <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                    <RiSearchLine className="text-gray-400 shrink-0" size={18} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={`Search in ${categoryName}...`}
                        className="bg-transparent outline-none w-full text-sm text-gray-800 placeholder-gray-400"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="text-gray-400 hover:text-gray-650 shrink-0 cursor-pointer"
                            aria-label="Clear search"
                        >
                            <RiCloseLine size={18} />
                        </button>
                    )}
                </div>
            </header>

            {/* CONTENT */}
            <div className="p-4">
                <div>
                    <h3 className="font-semibold text-gray-800 mb-4 text-sm text-left">
                        {search.trim() === "" ? `All ${categoryName}` : `Search Results (${filteredVendors.length})`}
                    </h3>

                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="flex gap-3 animate-pulse">
                                    <div className="w-16 h-16 bg-zinc-200 rounded-xl shrink-0" />
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-4 bg-zinc-200 rounded w-1/3" />
                                        <div className="h-3 bg-zinc-200 rounded w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredVendors.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl">
                            <p className="text-gray-500 text-sm">No restaurants found matching "{search}"</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredVendors.map((vendor) => {
                                const shopPhoto = vendor.kycdetail?.shop_photo?.url!;
                                const itemsCount = (vendor as any).items_count;
                                const deliveryTime = (vendor as any).delivery_time;
                                const costForTwo = (vendor as any).cost_for_two;
                                const hasMeta = itemsCount || deliveryTime || costForTwo;

                                return (
                                    <Link
                                        key={vendor.id}
                                        href={`/category/${categoryId}/subcategory/${vendor.business_sub_category_id}?vendorId=${vendor.id}`}
                                        className="flex gap-4 p-2 hover:bg-gray-50 rounded-xl transition border border-transparent hover:border-gray-100 text-left"
                                    >
                                        <img
                                            src={shopPhoto || undefined}
                                            alt={vendor.business_name}
                                            className="w-16 h-16 object-cover rounded-xl shadow-sm shrink-0"
                                        />
                                        <div className="flex-1 min-w-0 py-1">
                                            <h4 className="font-bold text-gray-800 text-sm truncate">
                                                {vendor.business_name}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {vendor.sub_category?.name || "Restaurant"}
                                            </p>
                                            {hasMeta && (
                                                <div className="flex items-center gap-1.5 text-[11px] text-gray-450 mt-2 font-medium">
                                                    {itemsCount && <span>{itemsCount} Items</span>}
                                                    {itemsCount && deliveryTime && (
                                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mx-1"></span>
                                                    )}
                                                    {deliveryTime && <span>{deliveryTime} mins</span>}
                                                    {((itemsCount || deliveryTime) && costForTwo) && (
                                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mx-1"></span>
                                                    )}
                                                    {costForTwo && <span>₹{costForTwo} for two</span>}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <BottomNavigation />
        </main>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Loading Search...</p>
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
