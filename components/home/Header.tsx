"use client";

import React from "react";
import Link from "next/link";
import { RiArrowDownSLine, RiNotificationLine, RiShoppingCartLine } from "react-icons/ri";
import { useAuthContext } from "@/providers/AuthProvider";
import { useCart } from "@/hooks/cart/useCart";
import { formatAddress } from "@/utils/address";
import HeaderProfileMenu from "./HeaderProfileMenu";

interface HeaderProps {
    onOpenLocation: () => void;
}

export default function Header({ onOpenLocation }: HeaderProps) {
    const { user, selectedAddress, userId } = useAuthContext();
    
    // Fetch cart count
    const { data: cartData } = useCart(userId!);
    const cartCount = cartData?.data?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-b from-purple-600 to-purple-800 p-4 pb-6">
            <div className="flex justify-between items-center text-white">
                <div className="text-left">
                    <h1 className="text-base font-bold transition-all duration-200">
                        {user?.name || "Guest User"}
                    </h1>

                    <button
                        onClick={onOpenLocation}
                        className="text-[13px] text-white/85 flex items-center gap-1 hover:text-white transition active:scale-[0.98] max-w-[220px] md:max-w-xs"
                    >
                        <span className="truncate">
                            {selectedAddress 
                                ? formatAddress(selectedAddress) 
                                : "Select delivery location"}
                        </span>
                        <RiArrowDownSLine size={18} className="shrink-0" />
                    </button>
                </div>

                <div className="flex gap-3 items-center">
                    <button className="relative bg-white/20 hover:bg-white/30 rounded-full p-3 transition active:scale-95">
                        <RiNotificationLine size={20} />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    </button>

                    {/* Cart Icon */}
                    <Link
                        href="/cart"
                        className="relative bg-white/20 hover:bg-white/30 rounded-full p-3 transition active:scale-95 flex items-center justify-center text-white cursor-pointer"
                        aria-label="View Cart"
                    >
                        <RiShoppingCartLine size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-extrabold text-white border border-purple-700">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Profile Dropdown with Hover & Logout */}
                    <HeaderProfileMenu dark />
                </div>
            </div>
        </header>
    );
}
