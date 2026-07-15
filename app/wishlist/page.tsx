"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    RiArrowLeftLine,
    RiShoppingCartLine,
    RiHeartFill,
    RiDeleteBin6Line,
} from "react-icons/ri";
import { useAuthContext } from "@/providers/AuthProvider";
import { useCart, useAddToCart } from "@/hooks/cart/useCart";
import HeaderProfileMenu from "@/components/home/HeaderProfileMenu";
import { showToast } from "@/utils/toast";

export default function WishlistPage() {
    const router = useRouter();
    const { userId } = useAuthContext();
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);

    const { data: cartData } = useCart(userId!);
    const cartCount = cartData?.data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const addToCartMutation = useAddToCart(userId!);

    // Load from local storage
    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                const saved = localStorage.getItem("wishlist_items");
                setWishlistItems(saved ? JSON.parse(saved) : []);
            } catch (err) {
                console.error("Failed to load wishlist items:", err);
            }
        }
    }, []);

    const handleRemoveFromWishlist = (id: string, name: string) => {
        const updated = wishlistItems.filter((item) => item.product_id !== id);
        setWishlistItems(updated);
        if (typeof window !== "undefined") {
            localStorage.setItem("wishlist_items", JSON.stringify(updated));
        }
        showToast.success(`Removed ${name} from wishlist.`);
    };

    const handleAddToCart = async (item: any) => {
        const businessId = item.business?.business_id || item.business?.id;
        if (!businessId) {
            showToast.error("Could not find merchant details for this product.");
            return;
        }

        const payload = {
            user_id: userId!,
            business_id: businessId,
            business_category_id: item.business_category_id || "",
            product_id: item.product_id,
            quantity: 1,
        };

        try {
            await addToCartMutation.mutateAsync(payload);
        } catch (error: any) {
            console.error("Error adding to cart:", error);
        }
    };

    return (
        <div className="bg-[#F1F3F6] min-h-screen max-w-3xl mx-auto flex flex-col pb-10 font-sans">
            {/* HEADER */}
            <header className="py-3.5 px-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex justify-center items-center bg-purple-100 text-purple-700 hover:bg-purple-200 w-8 h-8 rounded-full transition active:scale-90 cursor-pointer animate-fade-in"
                        aria-label="Go back"
                    >
                        <RiArrowLeftLine size={16} />
                    </button>
                    <div className="text-left">
                        <h3 className="font-bold text-gray-800 text-sm leading-none">My Wishlist</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5 font-bold">
                            {wishlistItems.length} Item{wishlistItems.length === 1 ? "" : "s"}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 text-xl text-purple-650 items-center">
                    <HeaderProfileMenu />
                    
                    <Link
                        href="/cart"
                        className="relative hover:opacity-80 flex items-center justify-center cursor-pointer text-purple-600"
                        aria-label="View Cart"
                    >
                        <RiShoppingCartLine size={22} />
                        {cartCount > 0 && (
                            <span className="absolute -right-1.5 -top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-extrabold text-white border border-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="p-4 flex-1 flex flex-col justify-between">
                {wishlistItems.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-gray-100 my-4 shadow-sm py-16">
                        <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-5 border border-purple-100 shadow-inner">
                            <RiHeartFill size={28} className="animate-pulse" />
                        </div>
                        <h3 className="text-base font-bold text-gray-800">Your wishlist is empty</h3>
                        <p className="text-gray-500 text-xs mt-1 mb-6 max-w-xs leading-relaxed">
                            Tap heart icons on items you like to save them here for later checkout.
                        </p>
                        <button
                            onClick={() => router.push("/home")}
                            className="px-8 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold shadow-md transition active:scale-[0.98] text-xs cursor-pointer"
                        >
                            Explore Products
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3.5">
                        {wishlistItems.map((item) => {
                            const finalPrice = item.final_price || item.selling_price || item.mrp;
                            return (
                                <div
                                    key={item.product_id}
                                    className="bg-white border border-gray-100/75 rounded-2xl p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 relative group text-left"
                                >
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleRemoveFromWishlist(item.product_id, item.name)}
                                        className="absolute top-3 right-3 z-10 bg-red-50 hover:bg-red-100 p-1.5 rounded-full text-red-550 shadow-sm border border-red-100/50 transition active:scale-90 cursor-pointer"
                                        aria-label="Remove item"
                                    >
                                        <RiDeleteBin6Line size={13} />
                                    </button>

                                    <div>
                                        <div className="relative h-28 w-full overflow-hidden rounded-xl bg-gray-50 mb-2">
                                            <img
                                                src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"}
                                                alt={item.name}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        </div>

                                        <p className="text-[10px] text-purple-700 font-bold uppercase tracking-wider leading-none">
                                            {item.business?.business_name || "Bazaar Store"}
                                        </p>
                                        <h4 className="text-xs font-bold text-gray-800 line-clamp-1 mt-0.5">
                                            {item.name}
                                        </h4>

                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <span className="text-sm font-extrabold text-gray-900">
                                                ₹{finalPrice}
                                            </span>
                                            {item.mrp && item.mrp > finalPrice && (
                                                <span className="text-[10px] text-gray-400 line-through">
                                                    ₹{item.mrp}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="w-full mt-3 bg-purple-700 hover:bg-purple-800 active:scale-[0.97] text-white rounded-lg py-1.5 text-[11px] font-bold shadow-sm transition-all duration-150 cursor-pointer flex items-center justify-center gap-1"
                                    >
                                        <RiShoppingCartLine size={13} />
                                        Add to Cart
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
