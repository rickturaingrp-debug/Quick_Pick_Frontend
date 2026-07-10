import React from "react";
import Link from "next/link";
import { RiShoppingBasketLine, RiArrowRightSLine } from "react-icons/ri";

interface ViewCartPopupProps {
    itemCount: number;
    isVisible: boolean;
}

export default function ViewCartPopup({ itemCount, isVisible }: ViewCartPopupProps) {
    return (
        <div 
            className={`fixed bottom-5 z-40 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-3 rounded-full flex items-center gap-4 shadow-xl w-[240px] transition-all duration-300 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
            }`}
        >
            {/* Basket Icon */}
            <span className="inline-flex justify-center items-center text-lg w-10 h-10 font-medium text-white bg-purple-500 shrink-0 rounded-full">
                <RiShoppingBasketLine size={20} />
            </span>

            <div className="flex-1 text-left">
                <p className="font-bold text-sm leading-none">View Cart</p>
                <p className="text-[13px] opacity-85 mt-1">
                    {itemCount} {itemCount === 1 ? "Item" : "Items"}
                </p>
            </div>

            {/* Arrow Button */}
            <Link 
                href="/cart" 
                className="w-10 h-10 bg-white text-black hover:bg-gray-100 rounded-full flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition"
                aria-label="Navigate to checkout"
            >
                <RiArrowRightSLine size={24} />
            </Link>
        </div>
    );
}
