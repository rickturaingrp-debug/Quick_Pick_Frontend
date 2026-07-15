"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    RiArrowLeftLine,
    RiArrowDownSLine,
    RiSearchLine,
    RiShoppingCartLine,
} from "react-icons/ri";
import { useAuthContext } from "@/providers/AuthProvider";
import { formatAddress } from "@/utils/address";
import HeaderProfileMenu from "../home/HeaderProfileMenu";

interface DetailsHeaderProps {
    onOpenLocation: () => void;
    cartCount?: number;
}

export default function DetailsHeader({
    onOpenLocation,
    cartCount = 0,
}: DetailsHeaderProps) {
    const router = useRouter();
    const { selectedAddress } = useAuthContext();

    return (
        <header className="py-4 px-4 sticky top-0 z-[9999] shadow-md bg-white">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex justify-center items-center bg-purple-700 w-8 h-8 rounded-full text-white hover:bg-purple-800 transition cursor-pointer"
                    >
                        <RiArrowLeftLine size={18} />
                    </button>
                    <div className="text-left">
                        <p className="text-xs text-gray-500">Delivering to</p>
                        <button
                            onClick={onOpenLocation}
                            className="font-medium text-purple-700 text-sm flex items-center gap-1 max-w-[180px] hover:opacity-85 cursor-pointer text-left"
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

                <div className="flex gap-4 text-xl text-purple-650 items-center">
                    <button className="hover:opacity-80 cursor-pointer">
                        <RiSearchLine size={22} />
                    </button>
                    
                    {/* User Profile Menu */}
                    <HeaderProfileMenu />

                    {/* Cart Icon */}
                    <Link
                        href="/cart"
                        className="relative hover:opacity-80 flex items-center justify-center cursor-pointer"
                        aria-label="View Cart"
                    >
                        <RiShoppingCartLine size={22} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold border border-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}
