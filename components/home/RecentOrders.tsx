import React from "react";
import { useRouter } from "next/navigation";
import { RiShoppingBag3Line, RiArrowRightSLine, RiCalendarLine } from "react-icons/ri";

interface RecentOrdersProps {
    orders: any[];
    isLoading: boolean;
    isError: boolean;
}

export default function RecentOrders({ orders, isLoading, isError }: RecentOrdersProps) {
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="space-y-4 px-4 mt-8 text-left">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Your Recent Orders</h3>
                <div className="h-28 bg-zinc-200 rounded-2xl animate-pulse" />
            </div>
        );
    }

    if (isError || orders.length === 0) {
        return null;
    }

    return (
        <div className="mt-8 px-4 text-left">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                <RiShoppingBag3Line className="text-purple-655" size={18} />
                Your Recent Orders
            </h3>
            <div className="space-y-4">
                {orders.map((order) => {
                    const formattedDate = new Date(order.placed_at || order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    });

                    const firstItem = order.items?.[0];
                    const itemCount = order.total_items || order.items?.length || 1;

                    return (
                        <div
                            key={order.id}
                            onClick={() => router.push(`/orders/${order.id}`)}
                            className="bg-white border border-gray-100 hover:border-purple-150/50 shadow-sm hover:shadow-md rounded-2xl p-4 cursor-pointer transition-all duration-300 flex items-center justify-between group"
                        >
                            <div className="flex-1 min-w-0 text-left">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-gray-800 text-sm truncate group-hover:text-purple-700 transition">
                                        {order.business?.business_name || "Quick Pick Merchant"}
                                    </h4>
                                    <span className="text-[10px] font-extrabold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-100 uppercase shrink-0">
                                        {order.order_status_label || "Placed"}
                                    </span>
                                </div>
                                
                                <p className="text-xs text-gray-500 font-medium mt-1 truncate">
                                    {firstItem ? firstItem.product_name : "Order item"}
                                    {itemCount > 1 && ` and ${itemCount - 1} other items`}
                                </p>

                                <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold mt-3">
                                    <span className="flex items-center gap-1">
                                        <RiCalendarLine size={12} /> {formattedDate}
                                    </span>
                                    <span className="text-purple-700 font-extrabold text-xs">
                                        ₹{order.grand_total}
                                    </span>
                                </div>
                            </div>

                            <RiArrowRightSLine className="text-gray-450 group-hover:text-purple-700 transition transform group-hover:translate-x-0.5 shrink-0" size={24} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
