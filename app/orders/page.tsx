"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    RiArrowLeftLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiInboxArchiveLine,
    RiRefreshLine,
} from "react-icons/ri";
import { useOrders } from "@/hooks/order/useOrders";
import OrderList from "@/components/orders/OrderList";
import { useAuthContext } from "@/providers/AuthProvider";

export default function MyOrdersPage() {
    const router = useRouter();
    const { userId } = useAuthContext();
    const [page, setPage] = useState(1);

    const { data: ordersData, isLoading, isError, refetch } = useOrders(userId!, page);

    const orders = ordersData?.data || [];
    const meta = ordersData?.meta;
    const lastPage = meta?.last_page || 1;

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < lastPage) setPage(page + 1);
    };

    // Loading
    if (isLoading) {
        return (
            <div className="bg-[#F7F4EE] min-h-screen max-w-3xl mx-auto flex flex-col">
                <header className="py-3.5 px-4 bg-white border-b border-[#EAE3D6] flex items-center gap-3 sticky top-0 z-50">
                    <div className="w-8 h-8 rounded-full bg-[#EFE9DB] animate-pulse" />
                    <div className="h-5 w-28 bg-[#EFE9DB] rounded animate-pulse" />
                </header>
                <main className="p-3 space-y-3 flex-1">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="bg-white rounded-2xl p-4 space-y-3 shadow-sm animate-pulse h-40" />
                    ))}
                </main>
            </div>
        );
    }

    // Error
    if (isError) {
        return (
            <div className="bg-[#F7F4EE] min-h-screen max-w-3xl mx-auto flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-red-50 text-red-500 p-4 rounded-full mb-4">
                    <RiInboxArchiveLine size={44} />
                </div>
                <h3 className="text-lg font-bold text-[#1E1B4B]">Unable to load orders</h3>
                <p className="text-[#8A8375] text-sm mt-1 mb-6 max-w-xs">
                    We had trouble fetching your order history. Please try again.
                </p>
                <button
                    onClick={() => refetch()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4C3F91] hover:bg-[#3E3378] text-white rounded-xl font-bold shadow-md shadow-[#4C3F91]/20 transition active:scale-95 text-sm"
                >
                    <RiRefreshLine size={16} />
                    Try Again
                </button>
            </div>
        );
    }

    // Empty
    if (!orders.length) {
        return (
            <div className="bg-[#F7F4EE] min-h-screen max-w-3xl mx-auto flex flex-col">
                <header className="py-3.5 px-4 bg-white border-b border-[#EAE3D6] flex items-center gap-3 sticky top-0 z-50">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex justify-center items-center bg-[#F1EDFB] text-[#4C3F91] hover:bg-[#E5DEF8] w-8 h-8 rounded-full transition active:scale-90"
                        aria-label="Go back"
                    >
                        <RiArrowLeftLine size={16} />
                    </button>
                    <h3 className="font-bold text-[#1E1B4B] text-sm">My Orders</h3>
                </header>
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-[#F1EDFB] text-[#4C3F91]/50 p-5 rounded-full mb-4">
                        <RiInboxArchiveLine size={40} />
                    </div>
                    <h3 className="text-sm font-bold text-[#1E1B4B]">No orders yet</h3>
                    <p className="text-[#A39C8C] text-xs mt-1 max-w-xs">
                        Items you order will show up here so you can track and manage them.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F7F4EE] min-h-screen max-w-3xl mx-auto flex flex-col relative pb-10">
            {/* HEADER */}
            <header className="py-3.5 px-4 bg-white border-b border-[#EAE3D6] flex items-center gap-3 sticky top-0 z-50">
                <button
                    onClick={() => router.back()}
                    className="inline-flex justify-center items-center bg-[#F1EDFB] text-[#4C3F91] hover:bg-[#E5DEF8] w-8 h-8 rounded-full transition active:scale-90"
                    aria-label="Go back"
                >
                    <RiArrowLeftLine size={16} />
                </button>
                <div>
                    <h3 className="font-bold text-[#1E1B4B] text-sm leading-none">My Orders</h3>
                    <p className="text-[11px] text-[#A39C8C] mt-0.5">
                        {meta?.total ?? orders.length} order{(meta?.total ?? orders.length) === 1 ? "" : "s"}
                    </p>
                </div>
            </header>

            {/* ORDERS CONTAINER */}
            <main className="p-3 flex-1 flex flex-col space-y-3">
                <OrderList orders={orders} />

                {/* PAGINATION CONTROLS */}
                {lastPage > 1 && (
                    <div className="flex items-center justify-between bg-white rounded-2xl p-2 shadow-sm mt-1 border border-[#EAE3D6]">
                        <button
                            onClick={handlePrevPage}
                            disabled={page === 1}
                            className="inline-flex items-center gap-1 py-1.5 px-3 hover:bg-[#F7F4EE] active:scale-95 disabled:opacity-40 disabled:scale-100 text-xs font-bold text-[#57534E] rounded-xl transition"
                        >
                            <RiArrowLeftSLine size={16} /> Previous
                        </button>

                        <span className="text-xs font-bold text-[#A39C8C]">
                            Page {page} of {lastPage}
                        </span>

                        <button
                            onClick={handleNextPage}
                            disabled={page === lastPage}
                            className="inline-flex items-center gap-1 py-1.5 px-3 hover:bg-[#F1EDFB] active:scale-95 disabled:opacity-40 disabled:scale-100 text-xs font-bold text-[#4C3F91] rounded-xl transition"
                        >
                            Next <RiArrowRightSLine size={16} />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}