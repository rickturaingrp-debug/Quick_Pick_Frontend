"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/home/Header";
import BottomNavigation from "@/components/home/BottomNavigation";
import CategoriesSection from "@/components/home/CategoriesSection";
import TrendingProducts from "@/components/home/TrendingProducts";
import PopularStores from "@/components/home/PopularStores";
import HomeBanners from "@/components/home/HomeBanners";
import { useAuthContext } from "@/providers/AuthProvider";
import { useBusinessCategories } from "@/hooks/category/useBusinessCategories";
import { useTrendingProducts } from "@/hooks/home/useTrendingProducts";
import { usePopularStores } from "@/hooks/home/usePopularStores";
import { RiSearchLine } from "react-icons/ri";

export default function HomePage() {
    const router = useRouter();
    const { openLocationPicker } = useAuthContext();

    // Fetch Category List
    const { data: apiResponse, isLoading: isCategoriesLoading, isError: isCategoriesError } = useBusinessCategories();
    const categoriesData = apiResponse?.data || [];

    // State & Action isolation hooks
    const trending = useTrendingProducts(categoriesData);
    const popular = usePopularStores(categoriesData);

    return (
        <main className="mx-auto min-h-screen max-w-3xl bg-gray-50 pb-28 text-left">
            {/* MAIN HEADER */}
            <Header onOpenLocation={openLocationPicker} />

            {/* SEARCH BAR SECTION */}
            <div className="relative z-10 mt-4 px-4">
            <button
                onClick={() => router.push("/category")}
                className="flex h-14 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition-colors hover:border-violet-200"
            >
                <RiSearchLine
                    size={20}
                    className="text-slate-400"
                />

                <span className="flex-1 text-left text-sm text-slate-500">
            Search for food, groceries, fashion...
        </span>
            </button>
        </div>

            {/* BANNERS SECTION */}
            <HomeBanners />

            {/* DYNAMIC CATEGORIES PREVIEW */}
            <CategoriesSection 
                categories={categoriesData} 
                isLoading={isCategoriesLoading} 
                isError={isCategoriesError} 
            />

            {/* DYNAMIC TRENDING PRODUCTS */}
            {categoriesData.length > 0 && (
                <TrendingProducts 
                    products={trending.products}
                    isLoading={trending.isLoading}
                    cartQuantities={trending.cartQuantities}
                    loadingProductId={trending.loadingProductId}
                    onAddQty={trending.handleAddQty}
                    onIncQty={trending.handleIncQty}
                    onDecQty={trending.handleDecQty}
                />
            )}

            {/* DYNAMIC POPULAR STORES */}
            {categoriesData.length > 0 && (
                <PopularStores 
                    vendors={popular.vendors}
                    isLoading={popular.isLoading}
                />
            )}

            {/* BOTTOM NAV */}
            <BottomNavigation />
        </main>
    );
}
