"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    RiCalendarLine,
    RiFileList2Line,
    RiCoinsLine,
    RiFilePdfLine,
    RiArrowDownSLine,
    RiArrowUpSLine
} from "react-icons/ri";
import { Order } from "@/types/order";
import { categoryApi } from "@/lib/axios";
import { showToast } from "@/utils/toast";

interface OrderCardProps {
    order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);
    const [downloadingInvoice, setDownloadingInvoice] = useState(false);

    const getStatusStyle = (status: string) => {
        const lower = status.toLowerCase();
        if (lower.includes("deliver")) {
            return "bg-green-50 text-green-700 border-green-200";
        }
        if (lower.includes("cancel") || lower.includes("fail")) {
            return "bg-red-50 text-red-700 border-red-200";
        }
        if (lower.includes("process") || lower.includes("ship")) {
            return "bg-blue-50 text-blue-700 border-blue-200";
        }
        return "bg-amber-50 text-amber-700 border-amber-200";
    };
    const statusBadge = getStatusStyle(order.order_status_label);

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (e) {
            return dateStr;
        }
    };

    const handleDownloadInvoice = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (downloadingInvoice) return;

        setDownloadingInvoice(true);
        try {
            const { data } = await categoryApi.get(`/member/orders/${order.id}/invoice`);
            if (data.success && data.invoice_url) {
                window.open(data.invoice_url, "_blank");
            } else {
                showToast.error(data.message || "Failed to load invoice url.");
            }
        } catch (err: any) {
            console.error(err);
            showToast.error("Unable to fetch invoice PDF. Please try again later.");
        } finally {
            setDownloadingInvoice(false);
        }
    };

    const items = order.items || [];
    const displayedItems = expanded ? items : items.slice(0, 1);
    const hasMoreItems = items.length > 1;

    return (
        <div
            onClick={() => router.push(`/orders/${order.id}`)}
            className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
        >
            {/* HEADER */}
            <div className="px-4 py-3 flex items-center justify-between gap-3 border-b border-gray-100">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-400 uppercase tracking-wide">
                            Order
                        </span>
                        <span className="text-xs font-semibold text-gray-900">
                            {order.order_no}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <RiCalendarLine size={12} />
                        {formatDate(order.placed_at || order.created_at)}
                    </div>
                </div>

                <span className={`px-2 py-0.5 text-[11px] font-medium rounded border shrink-0 ${statusBadge}`}>
                    {order.order_status_label}
                </span>
            </div>

            {/* ITEMS */}
            <div className="px-4 py-3 space-y-3">
                {displayedItems.map((item) => {
                    const itemImg = item.image || (item.product_snapshot && item.product_snapshot.image
                        ? `https://test.resheragroup.in/storage/${item.product_snapshot.image}`
                        : "");

                    const attrText = item.attributes && item.attributes.length > 0
                        ? item.attributes.map(a => `${a.name}: ${a.value}`).join(", ")
                        : null;

                    return (
                        <div key={item.id} className="flex gap-3 items-start">
                            <div className="w-11 h-11 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                <img
                                    src={itemImg}
                                    alt={item.product_name}
                                    className="object-cover w-full h-full"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-medium text-gray-900 truncate">
                                    {item.product_name}
                                </h4>
                                {attrText && (
                                    <p className="text-[11px] text-gray-400 truncate">
                                        {attrText}
                                    </p>
                                )}
                                <p className="text-[11px] text-gray-500">
                                    Qty: {item.quantity} × ₹{item.final_price}
                                </p>
                            </div>

                            <p className="text-xs font-medium text-gray-900 flex-shrink-0">
                                ₹{item.subtotal}
                            </p>
                        </div>
                    );
                })}

                {hasMoreItems && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpanded(!expanded);
                        }}
                        className="w-full text-center text-[11px] font-medium text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 pt-1 transition-colors"
                    >
                        {expanded ? (
                            <>Show less <RiArrowUpSLine size={13} /></>
                        ) : (
                            <>+{items.length - 1} more item{items.length - 1 > 1 ? "s" : ""} <RiArrowDownSLine size={13} /></>
                        )}
                    </button>
                )}
            </div>

            {/* FOOTER */}
            <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-3">
                <div className="flex items-center gap-4 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1">
                        <RiFileList2Line size={13} />
                        {order.total_items} item{order.total_items === 1 ? "" : "s"}
                    </span>
                    <span className="flex items-center gap-1">
                        <RiCoinsLine size={13} />
                        {order.payment_method_label}
                    </span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Total</p>
                        <p className="text-sm font-semibold text-gray-900">₹{order.grand_total}</p>
                    </div>

                    {order.order_status !== 0 && order.order_status !== 5 && (
                        <button
                            onClick={handleDownloadInvoice}
                            disabled={downloadingInvoice}
                            className="flex items-center gap-1.5 py-1.5 px-3 border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 text-[11px] font-medium rounded-md transition-colors"
                        >
                            <RiFilePdfLine size={13} />
                            {downloadingInvoice ? "Generating…" : "Invoice"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}