"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    RiArrowLeftLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiInboxArchiveLine,
    RiRefreshLine,
    RiShoppingCartLine,
} from "react-icons/ri";
import { useOrders } from "@/hooks/order/useOrders";
import { useCart } from "@/hooks/cart/useCart";
import OrderList from "@/components/orders/OrderList";
import { useAuthContext } from "@/providers/AuthProvider";
import HeaderProfileMenu from "@/components/home/HeaderProfileMenu";

export default function MyOrdersPage() {
    const router = useRouter();
    const { userId } = useAuthContext();
    const [page, setPage] = useState(1);

    const { data: ordersData, isLoading, isError, refetch } = useOrders(userId!, page);
    const { data: cartData } = useCart(userId!);
    const cartCount = cartData?.data?.reduce((sum, item) => sum + item.quantity, 0) || 0;

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
                <header className="py-3.5 px-4 bg-white border-b border-[#EAE3D6] flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#EFE9DB] animate-pulse" />
                        <div className="h-5 w-28 bg-[#EFE9DB] rounded animate-pulse" />
                    </div>
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
                    We encountered an issue fetching your order history.
                </p>
                <button
                    onClick={() => refetch()}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-md transition active:scale-95 text-sm cursor-pointer"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#F7F4EE] min-h-screen max-w-3xl mx-auto flex flex-col relative pb-10">
            {/* HEADER */}
            <header className="py-3.5 px-4 bg-white border-b border-[#EAE3D6] flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex justify-center items-center bg-[#F1EDFB] text-[#4C3F91] hover:bg-[#E5DEF8] w-8 h-8 rounded-full transition active:scale-90 cursor-pointer"
                        aria-label="Go back"
                    >
                        <RiArrowLeftLine size={16} />
                    </button>
                    <div className="text-left">
                        <h3 className="font-bold text-[#1E1B4B] text-sm leading-none">My Orders</h3>
                        <p className="text-[11px] text-[#A39C8C] mt-0.5 font-bold">
                            {meta?.total ?? orders.length} order{(meta?.total ?? orders.length) === 1 ? "" : "s"}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 text-xl text-purple-650 items-center">
                    <HeaderProfileMenu />
                    
                    <Link
                        href="/cart"
                        className="relative hover:opacity-80 flex items-center justify-center cursor-pointer text-purple-600"
                        aria-label="View Cart"
                    >
                        <RiShoppingCartLine size={22} />
                        {cartCount > 0 && (
                            <span className="absolute -right-1.5 -top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-extrabold text-white border border-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </header>

            {/* ORDERS LIST */}
            <main className="p-3 flex-1 flex flex-col justify-between">
                {orders.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-[#EAE3D6] my-4 shadow-sm">
                        <div className="w-16 h-16 bg-[#F7F4EE] text-[#8A8375] rounded-full flex items-center justify-center mb-5">
                            <RiInboxArchiveLine size={28} />
                        </div>
                        <h3 className="text-base font-bold text-[#1E1B4B]">No orders yet</h3>
                        <p className="text-[#8A8375] text-xs mt-1 mb-6 max-w-xs leading-relaxed">
                            You haven't placed any orders with us yet. Start exploring our categories to make your first purchase!
                        </p>
                        <button
                            onClick={() => router.push("/home")}
                            className="px-6 py-2.5 bg-[#4C3F91] hover:bg-[#3D327B] text-white rounded-xl font-bold shadow-md transition active:scale-[0.98] text-xs cursor-pointer"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <OrderList orders={orders} />
                    </div>
                )}

                {/* PAGINATION CONTROLS */}
                {lastPage > 1 && (
                    <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-[#EAE3D6] mt-4 shadow-sm">
                        <button
                            onClick={handlePrevPage}
                            disabled={page === 1}
                            className="flex items-center gap-1 text-xs font-bold text-[#4C3F91] disabled:opacity-40 disabled:pointer-events-none hover:bg-gray-50 px-3 py-2 rounded-xl transition cursor-pointer"
                        >
                            <RiArrowLeftSLine size={18} /> Prev
                        </button>

                        <span className="text-xs font-bold text-gray-500">
                            Page <span className="text-[#1E1B4B]">{page}</span> of {lastPage}
                        </span>

                        <button
                            onClick={handleNextPage}
                            disabled={page === lastPage}
                            className="flex items-center gap-1 text-xs font-bold text-[#4C3F91] disabled:opacity-40 disabled:pointer-events-none hover:bg-gray-50 px-3 py-2 rounded-xl transition cursor-pointer"
                        >
                            Next <RiArrowRightSLine size={18} />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}