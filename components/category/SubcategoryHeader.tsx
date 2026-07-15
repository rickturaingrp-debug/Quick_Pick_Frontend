"use client";

import { RiArrowDownSLine, RiArrowLeftLine, RiShoppingCartLine } from "react-icons/ri";
import SearchBar from "@/components/home/SearchBar";
import Link from "next/link";
import { useAuthContext } from "@/providers/AuthProvider";
import { useCart } from "@/hooks/cart/useCart";
import { formatAddress } from "@/utils/address";
import HeaderProfileMenu from "../home/HeaderProfileMenu";

interface SubcategoryHeaderProps {
    title: string;
    onOpenLocation: () => void;
    search: string;
    onSearchChange: (value: string) => void;
}

export default function SubcategoryHeader({
    title,
    onOpenLocation,
    search,
    onSearchChange,
}: SubcategoryHeaderProps) {
    const { selectedAddress, userId } = useAuthContext();
    
    // Fetch cart count
    const { data: cartData } = useCart(userId!);
    const cartCount = cartData?.data?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <header className="bg-gradient-to-b from-purple-600 to-purple-800 p-4 pb-6">
            <div className="flex items-center text-white justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Link href="/home" className="hover:opacity-85 flex items-center justify-center p-1 bg-white/10 rounded-full cursor-pointer shrink-0">
                        <RiArrowLeftLine size={20} />
                    </Link>

                    <div className="min-w-0 text-left">
                        <h1 className="text-base font-bold truncate">
                            {title}
                        </h1>

                        <button
                            onClick={onOpenLocation}
                            className="text-[13px] text-white/80 flex items-center gap-0.5 hover:text-white transition max-w-[180px] sm:max-w-[240px] text-left cursor-pointer"
                        >
                            <span className="truncate">
                                {selectedAddress
                                    ? formatAddress(selectedAddress)
                                    : "Select delivery location"}
                            </span>
                            <RiArrowDownSLine size={18} className="shrink-0" />
                        </button>
                    </div>
                </div>

                <div className="flex gap-2.5 items-center shrink-0">
                    {/* Cart Icon */}
                    <Link
                        href="/cart"
                        className="relative bg-white/20 hover:bg-white/30 rounded-full p-2.5 transition active:scale-95 flex items-center justify-center text-white cursor-pointer"
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

            <SearchBar value={search} onChange={onSearchChange} />
        </header>
    );
}
