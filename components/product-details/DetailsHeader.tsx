"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    RiArrowLeftLine,
    RiArrowDownSLine,
    RiSearchLine,
    RiUserLine,
    RiShoppingBag3Line,
} from "react-icons/ri";
import { useAuthContext } from "@/providers/AuthProvider";
import { formatAddress } from "@/utils/address";

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
                        className="inline-flex justify-center items-center bg-purple-700 w-8 h-8 rounded-full text-white hover:bg-purple-800 transition"
                    >
                        <RiArrowLeftLine size={18} />
                    </button>
                    <div>
                        <p className="text-xs text-gray-500">Delivering to</p>
                        <button
                            onClick={onOpenLocation}
                            className="font-medium text-purple-700 text-sm flex items-center gap-1 max-w-[180px] hover:opacity-85"
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
                    <button className="hover:opacity-80">
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
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}
