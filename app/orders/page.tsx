"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    RiArrowLeftLine,
    RiInboxArchiveLine,
    RiShoppingCartLine,
    RiSearchLine,
    RiRefreshLine,
} from "react-icons/ri";
import { useInfiniteOrders } from "@/hooks/order/useOrders";
import { useCart } from "@/hooks/cart/useCart";
import OrderList from "@/components/orders/OrderList";
import { useAuthContext } from "@/providers/AuthProvider";
import HeaderProfileMenu from "@/components/home/HeaderProfileMenu";

export default function MyOrdersPage() {
    const router = useRouter();
    const { userId } = useAuthContext();

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search term to minimize API requests
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { 
        data: ordersData, 
        isLoading, 
        isError, 
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch 
    } = useInfiniteOrders(userId!, 10, debouncedSearch);

    const { data: cartData } = useCart(userId!);
    const cartCount = cartData?.data?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    const orders = ordersData ? ordersData.pages.flatMap((page) => page.data) : [];
    const totalOrders = ordersData?.pages[0]?.meta?.total ?? 0;

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // Save scroll position in sessionStorage as the user scrolls
    useEffect(() => {
        const handleScroll = () => {
            sessionStorage.setItem("orders_scroll_pos", window.scrollY.toString());
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Restore scroll position once data is loaded and rendered
    useEffect(() => {
        if (!isLoading && orders.length > 0) {
            const savedScrollPos = sessionStorage.getItem("orders_scroll_pos");
            if (savedScrollPos) {
                const scrollY = parseInt(savedScrollPos, 10);
                if (scrollY > 0) {
                    const timer = setTimeout(() => {
                        window.scrollTo({
                            top: scrollY,
                            behavior: "instant" as ScrollBehavior,
                        });
                    }, 100);
                    return () => clearTimeout(timer);
                }
            }
        }
    }, [isLoading, orders.length]);

    // Handle Infinite scroll load trigger
    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Show a loading spinner in the search bar if we are actively fetching
    // first page results for a new search query.
    const isSearching = isFetching && !isFetchingNextPage;

    return (
        <div className="bg-[#F7F4EE] min-h-screen max-w-3xl mx-auto flex flex-col relative pb-10">
            {/* HEADER (Always visible) */}
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
                            {totalOrders} order{totalOrders === 1 ? "" : "s"}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 text-xl text-purple-650 items-center">
                    {/* Manual Refresh Button */}
                    <button
                        onClick={() => refetch()}
                        className="hover:opacity-80 flex items-center justify-center cursor-pointer text-purple-650 transition active:scale-95"
                        aria-label="Refresh orders list"
                        title="Refresh orders list"
                    >
                        <RiRefreshLine 
                            size={22} 
                            className={isFetching && !isFetchingNextPage ? "animate-spin" : ""} 
                        />
                    </button>

                    <HeaderProfileMenu />
                    
                    <Link
                        href="/cart"
                        className="relative hover:opacity-80 flex items-center justify-center cursor-pointer text-purple-650"
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

            {/* MAIN CONTAINER */}
            <main className="p-3 flex-1 flex flex-col">
                {/* SEARCH INPUT BAR (Always visible and focused, never unmounts) */}
                <div className="mb-4">
                    <div className="bg-white rounded-2xl flex items-center px-4 py-3 border border-[#EAE3D6] focus-within:border-purple-300 transition-colors shadow-sm">
                        {isSearching ? (
                            <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                            <RiSearchLine className="text-gray-400 text-lg mr-2" />
                        )}
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by shop name, item or order number..."
                            className="flex-1 outline-none text-xs bg-transparent text-[#1E1B4B] placeholder-gray-400"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="text-xs text-gray-400 hover:text-purple-600 font-bold px-1 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* ERROR STATE */}
                {isError ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white rounded-3xl border border-[#EAE3D6] my-2 shadow-sm">
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
                ) : isLoading ? (
                    // skeleton load content section only (Search input and header remain interactive)
                    <div className="space-y-3 flex-1">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-white rounded-2xl p-4 space-y-3 shadow-sm animate-pulse h-40" />
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    // empty state or no matching search results
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-[#EAE3D6] my-2 shadow-sm">
                        <div className="w-16 h-16 bg-[#F7F4EE] text-[#8A8375] rounded-full flex items-center justify-center mb-5">
                            <RiInboxArchiveLine size={28} />
                        </div>
                        <h3 className="text-base font-bold text-[#1E1B4B]">
                            {debouncedSearch ? "No matching orders" : "No orders yet"}
                        </h3>
                        <p className="text-[#8A8375] text-xs mt-1 mb-6 max-w-xs leading-relaxed">
                            {debouncedSearch 
                                ? "We couldn't find any orders matching your search. Please check the spelling or try a different term."
                                : "You haven't placed any orders with us yet. Start exploring our categories to make your first purchase!"}
                        </p>
                        {!debouncedSearch ? (
                            <button
                                onClick={() => router.push("/home")}
                                className="px-6 py-2.5 bg-[#4C3F91] hover:bg-[#3D327B] text-white rounded-xl font-bold shadow-md transition active:scale-[0.98] text-xs cursor-pointer"
                            >
                                Start Shopping
                            </button>
                        ) : (
                            <button
                                onClick={() => setSearch("")}
                                className="px-6 py-2.5 bg-[#4C3F91] hover:bg-[#3D327B] text-white rounded-xl font-bold shadow-md transition active:scale-[0.98] text-xs cursor-pointer"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    // actual order list content
                    <div className="space-y-3">
                        <OrderList orders={orders} />
                        
                        {/* Sentinel element to trigger load more */}
                        <div ref={loadMoreRef} className="h-4" />

                        {/* Skeleton loader cards at bottom while fetching next page */}
                        {isFetchingNextPage && (
                            <div className="space-y-3 pt-3">
                                {[1, 2].map((n) => (
                                    <div key={n} className="bg-white rounded-2xl p-4 space-y-3 shadow-sm animate-pulse h-40" />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}