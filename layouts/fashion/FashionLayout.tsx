import React from "react";
import FashionBanner from "./components/FashionBanner";
import SubcategoryScroll from "@/components/category/SubcategoryScroll";
import FashionProductGrid from "./components/FashionProductGrid";
import { Product } from "@/types/product";
import { BusinessSubCategory } from "@/types/category";

interface FashionLayoutProps {
    categoryId: string;
    subCategoryId: string;
    activeVendorId: string | null;
    subcategories: BusinessSubCategory[];
    products: Product[];
    isProductsLoading: boolean;
    onOpenFilter: () => void;
}

export default function FashionLayout({
    categoryId,
    subCategoryId,
    activeVendorId,
    subcategories,
    products,
    isProductsLoading,
    onOpenFilter
}: FashionLayoutProps) {
    return (
        <>
            {/* Fashion Layout Banner */}
            <FashionBanner businessId={activeVendorId} />

            {/* Subcategories Horizontal Scroll under categories header */}
            <section className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">Categories</h3>
                <SubcategoryScroll
                    categoryId={categoryId}
                    subCategoryId={subCategoryId}
                    subcategories={subcategories}
                />
            </section>

            {/* Fashion Product Grid */}
            <FashionProductGrid
                products={products}
                isLoading={isProductsLoading}
                activeVendorId={activeVendorId}
                onOpenFilter={onOpenFilter}
            />
        </>
    );
}
