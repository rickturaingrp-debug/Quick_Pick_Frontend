"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RiInboxArchiveLine, RiStore2Line } from "react-icons/ri";
import { Order } from "@/types/order";
import OrderCard from "./OrderCard";

interface OrderListProps {
    orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
    const router = useRouter();

    if (orders.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-[#EAE3D6] shadow-sm min-h-[350px]">
                <div className="w-16 h-16 bg-[#F1EDFB] text-[#4C3F91] rounded-full flex items-center justify-center mb-5 border border-[#E5DEF8]">
                    <RiInboxArchiveLine size={28} />
                </div>
                <h3 className="text-base font-bold text-[#1E1B4B]">No orders found</h3>
                <p className="text-[#A39C8C] text-xs mt-1.5 mb-6 max-w-xs leading-relaxed">
                    You haven't placed any orders with Bazaar yet. Browse our selection and place your first order!
                </p>
                <button
                    onClick={() => router.push("/home")}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4C3F91] hover:bg-[#3E3378] active:scale-[0.98] text-white rounded-xl font-bold shadow-md shadow-[#4C3F91]/20 transition text-xs"
                >
                    <RiStore2Line size={15} />
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    );
}