import React from "react";
import { Product } from "@/types/product";
import { Vendor } from "@/types/vendor";
import RestaurantBanner from "./components/RestaurantBanner";
import RestaurantInfoCard from "./components/RestaurantInfoCard";
import MenuProductRow from "./components/MenuProductRow";
import ProductDetailsModal from "./components/ProductDetailsModal";
import ViewCartPopup from "./components/ViewCartPopup";
import { useFoodLayout } from "./hooks/useFoodLayout";
import Link from "next/link";
import { RiArrowLeftLine, RiArrowDownSLine, RiSearchLine, RiUserLine, RiShoppingCartLine } from "react-icons/ri";

interface FoodLayoutProps {
    categoryId: string;
    activeVendorId: string | null;
    vendors: Vendor[];
    products: Product[];
    isProductsLoading: boolean;
    openLocationPicker: () => void;
}

export default function FoodLayout({
    categoryId,
    activeVendorId,
    vendors,
    products,
    isProductsLoading,
    openLocationPicker
}: FoodLayoutProps) {
    const {
        selectedProductForModal,
        setSelectedProductForModal,
        isModalOpen,
        setIsModalOpen,
        cartMap,
        totalItemsInCart,
        handleAdd,
        handleIncrement,
        handleDecrement,
        handleModalAdd,
        shopPhoto,
        restaurantName,
        addressText,
    } = useFoodLayout(categoryId, activeVendorId, vendors);

    return (
        <main className="mx-auto min-h-screen max-w-3xl bg-white pb-24 relative">
            {/* HEADER */}
            <header className="py-4 px-4 sticky top-0 z-40 shadow-md bg-white">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/category/${categoryId}`}
                            className="inline-flex justify-center items-center bg-purple-700 w-8 h-8 rounded-full cursor-pointer hover:bg-purple-800 transition"
                        >
                            <RiArrowLeftLine className="text-white" size={18} />
                        </Link>
                        <div className="text-left">
                            <p className="text-xs text-gray-500">Delivering to</p>
                            <button
                                onClick={openLocationPicker}
                                className="font-medium text-purple-700 text-sm flex items-center gap-1 max-w-[180px] sm:max-w-[500px] hover:text-purple-800 transition text-left cursor-pointer"
                            >
                                <span className="truncate">{addressText}</span>
                                <RiArrowDownSLine className="flex-shrink-0 text-purple-700" size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4 text-xl text-purple-650 items-center">
                        <Link href={`/search?categoryId=${categoryId}`} className="text-purple-705 hover:opacity-80 transition cursor-pointer" aria-label="Search">
                            <RiSearchLine />
                        </Link>
                        <Link href="/cart" className="text-purple-705 hover:opacity-80 transition cursor-pointer relative flex items-center" aria-label="Cart">
                            <RiShoppingCartLine />
                            {totalItemsInCart > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-white">
                                    {totalItemsInCart}
                                </span>
                            )}
                        </Link>
                        <Link href="/home" className="text-purple-705 hover:opacity-80 transition cursor-pointer" aria-label="Account">
                            <RiUserLine />
                        </Link>
                    </div>
                </div>
            </header>

            {/* BANNER COVER SLIDER */}
            <RestaurantBanner businessId={activeVendorId} shopPhoto={shopPhoto} />

            {/* RESTAURANT METADATA OVERLAY */}
            <RestaurantInfoCard name={restaurantName} />

            {/* PRODUCT LIST */}
            <section className="bg-white px-2">
                {isProductsLoading ? (
                    <div className="space-y-4 px-4 py-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="flex justify-between gap-4 border-b border-gray-150 pb-8 pt-6 animate-pulse">
                                <div className="flex-1 space-y-3">
                                    <div className="h-5 bg-zinc-200 rounded w-2/3" />
                                    <div className="h-3 bg-zinc-200 rounded w-5/6" />
                                    <div className="h-6 bg-zinc-200 rounded w-1/4 mt-3" />
                                </div>
                                <div className="w-36 h-32 bg-zinc-200 rounded-xl shrink-0" />
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl m-4">
                        <p className="text-gray-500 text-sm">No items found on the menu for this restaurant.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {products.map((product) => {
                            const cartInfo = cartMap.get(product.product_id);
                            const qty = cartInfo?.quantity || 0;
                            const cartItemId = cartInfo?.cartItemId || "";

                            return (
                                <MenuProductRow
                                    key={product.product_id}
                                    product={product}
                                    quantityInCart={qty}
                                    onAdd={() => handleAdd(product)}
                                    onIncrement={() => handleIncrement(product.product_id, cartItemId, qty)}
                                    onDecrement={() => handleDecrement(product.product_id, cartItemId, qty)}
                                    onClickRow={() => {
                                        setSelectedProductForModal(product);
                                        setIsModalOpen(true);
                                    }}
                                />
                            );
                        })}
                    </div>
                )}
            </section>

            {/* VIEW CART FLOATING BAR */}
            <ViewCartPopup itemCount={totalItemsInCart} isVisible={totalItemsInCart > 0} />

            {/* PRODUCT DETAILS MODAL */}
            <ProductDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProductForModal}
                businessId={activeVendorId}
                onAddToCart={handleModalAdd}
            />
        </main>
    );
}
