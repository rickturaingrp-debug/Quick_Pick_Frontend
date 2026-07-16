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
            <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg border border-gray-200 min-h-[320px]">
                <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4 border border-gray-200">
                    <RiInboxArchiveLine size={22} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">No orders found</h3>
                <p className="text-xs text-gray-500 mt-1 mb-5 max-w-xs leading-relaxed">
                    You haven't placed any orders with Bazaar yet. Browse our selection and place your first order.
                </p>
                <button
                    onClick={() => router.push("/home")}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md font-medium transition-colors text-xs"
                >
                    <RiStore2Line size={14} />
                    Start shopping
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    );
}