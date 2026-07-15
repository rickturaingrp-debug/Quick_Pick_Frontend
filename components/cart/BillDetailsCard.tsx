"use client";

import { RiFileListLine, RiShoppingBagLine, RiMotorbikeLine } from "react-icons/ri";

interface BillDetailsCardProps {
    itemsTotal: number;
    platformCharge: number;
    deliveryCharge: number;
    itemCount: number;
}

export default function BillDetailsCard({
    itemsTotal,
    platformCharge,
    deliveryCharge,
    itemCount,
}: BillDetailsCardProps) {
    
    const grandTotal = itemsTotal + platformCharge + deliveryCharge;

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3.5 border border-gray-50">
            <h2 className="font-semibold text-gray-900 text-sm">Bill details</h2>

            {/* Items Total */}
            <div className="flex justify-between text-xs text-gray-600">
                <div className="flex items-center gap-2">
                    <RiFileListLine className="text-gray-400" size={16} />
                    Items total
                </div>
                <div className="font-medium text-gray-900">
                    ₹{itemsTotal}
                </div>
            </div>

            {/* Platform Charge */}
            <div className="flex justify-between text-xs text-gray-600">
                <div className="flex items-center gap-2">
                    <RiShoppingBagLine className="text-gray-400" size={16} />
                    Platform charge
                </div>
                <div className="font-medium text-gray-900">
                    ₹{platformCharge}
                </div>
            </div>

            {/* Delivery Charge */}
            <div className="flex justify-between text-xs text-gray-600">
                <div className="flex items-center gap-2">
                    <RiMotorbikeLine className="text-gray-400" size={16} />
                    Delivery charge
                </div>
                <div className="font-medium text-green-600 font-semibold">
                    FREE
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Total Row */}
            <div className="flex justify-between text-sm items-center pt-0.5">
                <div className="font-semibold text-gray-700">
                    Items - {itemCount.toString().padStart(2, "0")}
                </div>
                <div className="text-purple-700 font-bold text-base flex items-baseline gap-1.5">
                    <span className="text-xs text-gray-400 font-medium">Grand total</span>
                    ₹{grandTotal}
                </div>
            </div>
        </div>
    );
}
