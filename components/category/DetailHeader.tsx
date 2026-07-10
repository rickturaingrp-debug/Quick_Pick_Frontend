"use client";

import Link from "next/link";
import {
    RiArrowLeftLine,
    RiArrowDownSLine,
    RiSearchLine,
    RiUserLine,
    RiShoppingBag3Line,
} from "react-icons/ri";
import { useAuthContext } from "@/providers/AuthProvider";
import { useCart } from "@/hooks/cart/useCart";
import { formatAddress } from "@/utils/address";

interface DetailHeaderProps {
    categoryId: string;
    onOpenLocation: () => void;
    onOpenFilter: () => void;
}

export default function DetailHeader({
    categoryId,
    onOpenLocation,
    onOpenFilter,
}: DetailHeaderProps) {
    const { userId, selectedAddress } = useAuthContext();
    const { data: cartData } = useCart(userId!);
    const cartCount = cartData?.data?.length || 0;

    return (
        <header className="sticky top-0 z-40 bg-white px-4 py-4 shadow-md">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/category/${categoryId}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-purple-700 text-white hover:bg-purple-800 transition"
                    >
                        <RiArrowLeftLine size={18} />
                    </Link>
                    <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Delivering to</p>
                        <button
                            onClick={onOpenLocation}
                            className="flex items-center gap-1 text-sm font-semibold text-purple-700 max-w-[180px] sm:max-w-[300px]"
                        >
                            <span className="truncate">
                                {selectedAddress
                                    ? formatAddress(selectedAddress)
                                    : "Select delivery location"}
                            </span>
                            <RiArrowDownSLine size={16} className="flex-shrink-0" />
                        </button>
                    </div>
                </div>

                <div className="flex gap-4 text-xl text-purple-600 items-center">
                    <button onClick={onOpenFilter} className="hover:opacity-80">
                        <RiSearchLine size={22} />
                    </button>
                    <button className="hover:opacity-80">
                        <RiUserLine size={22} />
                    </button>
                    <Link
                        href="/cart"
                        className="relative hover:opacity-80 flex items-center justify-center"
                        aria-label="View Cart"
                    >
                        <RiShoppingBag3Line size={22} />
                        {cartCount > 0 && (
                            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}
