import React from "react";
import SubcategoryScroll from "@/components/category/SubcategoryScroll";
import OfferBanner from "@/components/category/OfferBanner";
import ProductGrid from "@/components/category/ProductGrid";
import { Product } from "@/types/product";
import { BusinessSubCategory } from "@/types/category";

interface DefaultLayoutProps {
    categoryId: string;
    subCategoryId: string;
    activeVendorId: string | null;
    subcategories: BusinessSubCategory[];
    products: Product[];
    isProductsLoading: boolean;
    subcategoryTitle: string;
}

export default function DefaultLayout({
    categoryId,
    subCategoryId,
    activeVendorId,
    subcategories,
    products,
    isProductsLoading,
    subcategoryTitle
}: DefaultLayoutProps) {
    return (
        <>
            {/* Electronics / Default Layout Variation */}
            <SubcategoryScroll
                categoryId={categoryId}
                subCategoryId={subCategoryId}
                subcategories={subcategories}
            />

            <OfferBanner businessId={activeVendorId} />

            <ProductGrid
                products={products}
                isLoading={isProductsLoading}
                activeVendorId={activeVendorId}
                subcategoryTitle={subcategoryTitle}
            />
        </>
    );
}
