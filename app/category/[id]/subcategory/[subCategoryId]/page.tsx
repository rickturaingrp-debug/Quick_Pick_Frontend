"use client";

import { useSubcategoryDetails } from "@/hooks/category/useSubcategoryDetails";
import DetailHeader from "@/components/category/DetailHeader";
import VendorScroll from "@/components/category/VendorScroll";
import FilterSheet, { FilterState } from "@/components/category/FilterSheet";
import { useAuthContext } from "@/providers/AuthProvider";

// Layouts
import FashionLayout from "@/layouts/fashion/FashionLayout";
import FoodLayout from "@/layouts/food/FoodLayout";
import DefaultLayout from "@/layouts/default/DefaultLayout";

export default function SubcategoryDetailPage() {
    const {
        categoryId,
        subCategoryId,
        openFilter,
        setOpenFilter,
        setSelectedVendorId,
        activeVendorId,
        vendors,
        isVendorsLoading,
        subcategories,
        subcategoryTitle,
        categoryName,
        isFashion,
        products,
        isProductsLoading,
        setActiveFilters,
        filterOptions,
    } = useSubcategoryDetails();
    const { openLocationPicker } = useAuthContext();

    const isFood = categoryName.toLowerCase().includes("food") || categoryName.toLowerCase().includes("restaurant");

    const handleApplyFilters = (filters: FilterState) => {
        setActiveFilters(filters);
    };

    if (isFood) {
        return (
            <FoodLayout
                categoryId={categoryId}
                activeVendorId={activeVendorId}
                vendors={vendors}
                products={products}
                isProductsLoading={isProductsLoading}
                openLocationPicker={openLocationPicker}
            />
        );
    }

    return (
        <main className={`mx-auto min-h-screen max-w-3xl pb-20 ${isFashion ? "bg-white" : "bg-slate-50"}`}>
            {/* Header Component */}
            <DetailHeader
                categoryId={categoryId}
                onOpenLocation={openLocationPicker}
                onOpenFilter={() => setOpenFilter(true)}
            />

            {/* Vendor Banner Scroll Component */}
            <VendorScroll
                vendors={vendors}
                isLoading={isVendorsLoading}
                activeVendorId={activeVendorId}
                onSelectVendor={setSelectedVendorId}
            />

            {isFashion ? (
                <FashionLayout
                    categoryId={categoryId}
                    subCategoryId={subCategoryId}
                    activeVendorId={activeVendorId}
                    subcategories={subcategories}
                    products={products}
                    isProductsLoading={isProductsLoading}
                    onOpenFilter={() => setOpenFilter(true)}
                />
            ) : (
                <DefaultLayout
                    categoryId={categoryId}
                    subCategoryId={subCategoryId}
                    activeVendorId={activeVendorId}
                    subcategories={subcategories}
                    products={products}
                    isProductsLoading={isProductsLoading}
                    subcategoryTitle={subcategoryTitle}
                />
            )}

            {/* Filters Bottom Sheet */}
            <FilterSheet
                open={openFilter}
                onClose={() => setOpenFilter(false)}
                onApply={handleApplyFilters}
                categories={filterOptions.categories}
                sizes={filterOptions.sizes}
                colors={filterOptions.colors}
                fabrics={filterOptions.fabrics}
            />
        </main>
    );
}
