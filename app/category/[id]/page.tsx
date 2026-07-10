"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { RiArrowLeftLine, RiSearchLine, RiUserLine, RiArrowDownSLine } from "react-icons/ri";
import { useBusinessSubCategories } from "@/hooks/category/useBusinessSubCategories";
import { useBusinessCategories } from "@/hooks/category/useBusinessCategories";
import { useVendors } from "@/hooks/vendor/useVendors";
import CategoryCard from "@/components/home/CategoryCard";
import SubcategoryHeader from "@/components/category/SubcategoryHeader";
import BottomNavigation from "@/components/home/BottomNavigation";
import { useAuthContext } from "@/providers/AuthProvider";
import { formatAddress } from "@/utils/address";

export default function SubcategoryPage() {
    const params = useParams();
    const id = params.id as string;
    const [search, setSearch] = useState("");
    const { selectedAddress, openLocationPicker } = useAuthContext();

    // Fetch categories and subcategories to resolve name and check if it is food category
    const { data: categoriesResponse } = useBusinessCategories();
    const { data: apiResponse, isLoading: isSubcategoriesLoading, isError: isSubcategoriesError } = useBusinessSubCategories(id, search);
    const { data: vendorsResponse, isLoading: isVendorsLoading, isError: isVendorsError } = useVendors(id);

    const subcategories = apiResponse?.data || [];
    const categories = categoriesResponse?.data || [];
    const vendors = vendorsResponse?.data || [];

    const currentCategory = categories.find((cat) => cat.id === id);
    const categoryName = currentCategory?.name || subcategories[0]?.category?.name || "Subcategories";
    const isFood = categoryName.toLowerCase().includes("food") || categoryName.toLowerCase().includes("restaurant");

    const addressText = selectedAddress ? formatAddress(selectedAddress) : "";

    // Search filter for restaurants
    const filteredVendors = vendors.filter((vendor) =>
        vendor.business_name.toLowerCase().includes(search.toLowerCase())
    );

    if (isFood) {
        return (
            <main className="max-w-3xl mx-auto bg-white min-h-screen pb-24 relative">
                {/* HEADER */}
                <header className="py-4 px-4 sticky top-0 z-40 shadow-md bg-white">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/home"
                                className="inline-flex justify-center items-center bg-purple-700 w-8 h-8 rounded-full"
                            >
                                <RiArrowLeftLine className="text-white" size={18} />
                            </Link>
                            <div className="text-left">
                                <p className="text-xs text-gray-500">Delivering to</p>
                                <button
                                    onClick={openLocationPicker}
                                    className="font-medium text-purple-700 text-sm flex items-center gap-1 max-w-[180px] sm:max-w-[500px] hover:text-purple-800 transition text-left"
                                >
                                    <span className="truncate">{addressText}</span>
                                    <RiArrowDownSLine className="flex-shrink-0 text-purple-700" size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4 text-xl text-purple-600">
                            <Link
                                href={`/search?categoryId=${id}`}
                                className="text-purple-705 flex items-center hover:opacity-80 transition cursor-pointer"
                                aria-label="Search"
                            >
                                <RiSearchLine />
                            </Link>
                            <Link href="/home" className="text-purple-705 hover:opacity-80 transition" aria-label="Account">
                                <RiUserLine />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* RESTAURANTS FOR YOU (HORIZONTAL LIST) */}
                <section className="px-4 bg-slate-100 py-4">
                    <h2 className="font-medium mb-3 text-gray-900 text-left">Restaurants For You</h2>
                    <div className="flex gap-4 no-scrollbar overflow-x-auto">
                        {isVendorsLoading ? (
                            [1, 2, 3, 4].map((n) => (
                                <div key={n} className="min-w-[120px] animate-pulse">
                                    <div className="w-[120px] h-[80px] bg-zinc-200 rounded-xl" />
                                    <div className="h-3 bg-zinc-200 rounded mt-2 w-3/4 mx-auto" />
                                </div>
                            ))
                        ) : isVendorsError ? (
                            <div className="text-xs text-red-500 py-2">Failed to load restaurants for you</div>
                        ) : filteredVendors.length === 0 ? (
                            <p className="text-xs text-gray-500 py-2 text-left">No restaurants found</p>
                        ) : (
                            filteredVendors.slice(0, 5).map((vendor) => {
                                const shopPhoto = vendor.kycdetail?.shop_photo?.url!;
                                return (
                                    <Link
                                        key={`for-you-${vendor.id}`}
                                        href={`/category/${id}/subcategory/${vendor.business_sub_category_id}?vendorId=${vendor.id}`}
                                        className="min-w-[120px] block active:scale-[0.98] transition text-center"
                                    >
                                        <img
                                            src={shopPhoto || undefined}
                                            alt={vendor.business_name}
                                            className="w-[120px] h-[80px] object-cover rounded-xl shadow-sm"
                                        />
                                        <p className="text-[13px] mt-1 px-2 truncate font-medium text-gray-800 text-center">
                                            {vendor.business_name}
                                        </p>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* AVAILABLE RESTAURANTS (GRID LIST) */}
                <section className="px-4 py-6">
                    <h2 className="font-medium mb-4 text-gray-900 text-left">Available Restaurants</h2>
                    {isVendorsLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-8">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="animate-pulse space-y-3">
                                    <div className="w-full h-52 bg-zinc-200 rounded-xl" />
                                    <div className="space-y-2 px-3">
                                        <div className="h-5 bg-zinc-200 rounded w-2/3" />
                                        <div className="h-4 bg-zinc-200 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : isVendorsError ? (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-500">
                            Failed to load restaurants. Please try again later.
                        </div>
                    ) : filteredVendors.length === 0 ? (
                        <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
                            <p className="text-sm text-gray-500">No restaurants available matching "{search}"</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-5 gap-y-8">
                            {filteredVendors.map((vendor) => {
                                const shopPhoto = vendor.kycdetail?.shop_photo?.url!;

                                const itemsCount = (vendor as any).items_count;
                                const deliveryTime = (vendor as any).delivery_time;
                                const costForTwo = (vendor as any).cost_for_two;
                                const hasMeta = itemsCount || deliveryTime || costForTwo;

                                return (
                                    <Link
                                        key={vendor.id}
                                        href={`/category/${id}/subcategory/${vendor.business_sub_category_id}?vendorId=${vendor.id}`}
                                        className="block group text-left"
                                    >
                                        <div className="relative overflow-hidden rounded-xl">
                                            <img
                                                src={shopPhoto || undefined}
                                                alt={vendor.business_name}
                                                className="w-full h-52 object-cover rounded-xl group-hover:scale-[1.02] transition duration-300"
                                            />
                                        </div>
                                        <div className="px-3 pt-4 space-y-2 font-medium text-left">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg truncate font-semibold text-gray-800 leading-tight group-hover:text-purple-700 transition">
                                                    {vendor.business_name}
                                                </h3>
                                            </div>
                                            {hasMeta && (
                                                <p className="flex items-center text-[13px] text-gray-600 font-medium">
                                                    {itemsCount && <span>{itemsCount} Items</span>}
                                                    {itemsCount && deliveryTime && (
                                                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mx-2 shrink-0"></span>
                                                    )}
                                                    {deliveryTime && <span>{deliveryTime} mins</span>}
                                                    {((itemsCount || deliveryTime) && costForTwo) && (
                                                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mx-2 shrink-0"></span>
                                                    )}
                                                    {costForTwo && <span>₹{costForTwo} for two</span>}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </section>

                <BottomNavigation />
            </main>
        );
    }

    return (
        <main className="mx-auto min-h-screen max-w-3xl bg-gray-100 pb-24">
            <SubcategoryHeader
                title={categoryName}
                onOpenLocation={openLocationPicker}
                search={search}
                onSearchChange={setSearch}
            />

            <div className="p-4">
                {isSubcategoriesLoading ? (
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-36 sm:h-40 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : isSubcategoriesError ? (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-500">
                        Failed to load subcategories. Please try again later.
                    </div>
                ) : subcategories.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center text-zinc-500 dark:text-zinc-400">
                        No subcategories found.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {subcategories.map((sub) => (
                            <CategoryCard
                                key={sub.id}
                                category={{
                                    id: sub.id,
                                    title: sub.name,
                                    image: sub.image!,
                                    href: `/category/${id}/subcategory/${sub.id}`,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <BottomNavigation />
        </main>
    );
}
