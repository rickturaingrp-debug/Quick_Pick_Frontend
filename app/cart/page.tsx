"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    RiArrowLeftLine,
    RiShareLine,
    RiShoppingBag4Line,
    RiCheckboxCircleFill,
    RiExternalLinkLine
} from "react-icons/ri";
import { useCart, useUpdateCart, useRemoveCartItem } from "@/hooks/cart/useCart";
import { usePlaceOrder } from "@/hooks/order/usePlaceOrder";
import CartItemRow from "@/components/cart/CartItemRow";
import DeliveryAddressCard from "@/components/cart/DeliveryAddressCard";
import PaymentAndPlaceOrder from "@/components/cart/PaymentAndPlaceOrder";
import BillDetailsCard from "@/components/cart/BillDetailsCard";
import { useAuthContext } from "@/providers/AuthProvider";
import { formatAddress } from "@/utils/address";
import { showToast } from "@/utils/toast";
import HeaderProfileMenu from "@/components/home/HeaderProfileMenu";

export default function CheckoutPage() {
    const router = useRouter();
    const { userId, openLocationPicker, selectedAddress, user } = useAuthContext();

    // States
    const [paymentMethod, setPaymentMethod] = useState<"WALLET" | "ONLINE" | "COD">("ONLINE");
    const [successOrder, setSuccessOrder] = useState<any | null>(null);

    const addressStr = selectedAddress
        ? formatAddress(selectedAddress)
        : "No delivery location selected";

    // Queries & Mutations
    const { data: cartData, isLoading, isError, refetch } = useCart(userId!);
    const updateCartMutation = useUpdateCart(userId!);
    const removeCartItemMutation = useRemoveCartItem(userId!);
    const placeOrderMutation = usePlaceOrder(userId!);

    // Calculate totals
    const cartItems = cartData?.data || [];
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const itemsTotal = cartItems.reduce((sum, item) => sum + (item.product?.final_price || 0) * item.quantity, 0);
    const platformCharge = 2;
    const deliveryCharge = 0;

    const handleShare = () => {
        if (typeof window !== "undefined" && navigator.share) {
            navigator.share({
                title: "My Bazaar Checkout",
                text: `Checking out my order of ${totalQuantity} items at Bazaar!`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            showToast.success("Checkout link copied to clipboard!");
        }
    };

    const handleUpdateQuantity = async (cartId: string, qty: number) => {
        try {
            await updateCartMutation.mutateAsync({ cartId, quantity: qty });
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const handleRemoveItem = async (cartId: string) => {
        try {
            await removeCartItemMutation.mutateAsync(cartId);
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) return;

        if (!selectedAddress) {
            showToast.error("Please select a delivery address before placing your order.");
            openLocationPicker();
            return;
        }

        // Take business details from the first item
        const firstItem = cartItems[0];

        const payload = {
            user_id: userId!,
            phone: user?.phone ? String(user.phone) : (user?.mobile ? String(user.mobile) : ""),
            billing_address: addressStr,
            shipping_address: addressStr,
            payment_method: paymentMethod,
            loyalty_points: 0,
            notes: "Placed via dynamic web checkout",
            is_gst_bill: false,
            platformCharge: 2,
            deliveryCharge: 0,
        };

        try {
            const res = await placeOrderMutation.mutateAsync(payload);
            if (res.success) {
                const orderData = res.data as any;
                if (orderData && (orderData.platform_charge === 0 || orderData.platform_charge === undefined || orderData.platform_charge === null)) {
                    orderData.platform_charge = 2;
                    const calculatedTotalWithoutPlatform = (orderData.items_total || 0) + (orderData.delivery_charge || 0) + (orderData.tax_amount || 0) - (orderData.discount_amount || 0);
                    if (orderData.grand_total === calculatedTotalWithoutPlatform) {
                        orderData.grand_total += 2;
                    }
                }
                setSuccessOrder(orderData);
                showToast.success("Order placed successfully!");
            } else {
                showToast.error(res.message || "Failed to place order. Please try again.");
            }
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || error?.message || "Something went wrong";
            showToast.error(`Order placement failed: ${errorMsg}`);
        }
    };

    // Loading Skeleton State
    if (isLoading) {
        return (
            <div className="bg-[#F1F3F6] min-h-screen max-w-3xl mx-auto flex flex-col">
                <header className="py-3.5 px-4 bg-white border-b border-gray-100 flex items-center gap-3 sticky top-0 z-50">
                    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                </header>
                <main className="p-4 space-y-4 flex-1">
                    <div className="bg-white rounded-2xl p-4 space-y-4 border border-gray-100 shadow-sm">
                        <div className="flex gap-4">
                            <div className="w-14 h-14 bg-gray-200 rounded-xl animate-pulse" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                                <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse" />
                            </div>
                        </div>
                        <hr className="border-gray-100" />
                        <div className="flex gap-4">
                            <div className="w-14 h-14 bg-gray-200 rounded-xl animate-pulse" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                                <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 h-48 border border-gray-100 shadow-sm animate-pulse" />
                </main>
            </div>
        );
    }

    // Error State
    if (isError) {
        return (
            <div className="bg-[#F1F3F6] min-h-screen max-w-3xl mx-auto flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-full mb-4">
                    <RiShoppingBag4Line size={48} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Unable to load cart</h3>
                <p className="text-gray-500 text-sm mt-1 mb-6 max-w-xs">
                    We encountered an issue fetching your cart details from the server.
                </p>
                <button
                    onClick={() => refetch()}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-md transition active:scale-95 text-sm"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Empty Cart State
    if (cartItems.length === 0 && !successOrder) {
        return (
            <div className="bg-[#F1F3F6] min-h-screen max-w-3xl mx-auto flex flex-col">
                {/* HEADER */}
                <header className="py-3.5 px-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex justify-center items-center bg-purple-100 text-purple-700 hover:bg-purple-200 w-8 h-8 rounded-full transition active:scale-90"
                        >
                            <RiArrowLeftLine size={16} />
                        </button>
                        <h3 className="font-bold text-gray-800 text-sm">My Cart</h3>
                    </div>
                    <HeaderProfileMenu />
                </header>

                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white m-4 rounded-3xl shadow-sm border border-gray-100/50">
                    <div className="w-20 h-20 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-6">
                        <RiShoppingBag4Line size={36} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Your cart is empty</h3>
                    <p className="text-gray-500 text-xs mt-1.5 mb-8 max-w-xs leading-relaxed">
                        Looks like you haven't added anything to your cart yet. Head back to check out our fresh products!
                    </p>
                    <button
                        onClick={() => router.push("/home")}
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white rounded-xl font-bold shadow-md transition text-sm"
                    >
                        Explore Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F1F3F6] min-h-screen max-w-3xl mx-auto flex flex-col pb-36 relative">
            {/* HEADER */}
            <header className="py-3.5 px-4 bg-white border-b border-gray-100 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex justify-center items-center bg-purple-100 text-purple-700 hover:bg-purple-200 w-8 h-8 rounded-full transition active:scale-90"
                        aria-label="Go back"
                    >
                        <RiArrowLeftLine size={16} />
                    </button>
                    <h3 className="font-bold text-gray-800 text-sm">My Cart</h3>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleShare}
                        className="flex gap-1.5 py-1.5 px-4 border border-purple-200 rounded-full items-center text-purple-700 hover:bg-purple-50 transition active:scale-95 cursor-pointer shrink-0"
                    >
                        <RiShareLine size={14} />
                        <span className="text-[11px] font-bold">Share</span>
                    </button>
                    <HeaderProfileMenu />
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="p-4 space-y-4">
                {/* ORDER DETAILS / CART ITEMS */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                    <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            Order Details
                        </p>
                    </div>
                    {cartItems.map((item) => (
                        <CartItemRow
                            key={item.id}
                            item={item}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemoveItem={handleRemoveItem}
                        />
                    ))}
                </div>

                {/* BILL DETAILS */}
                <BillDetailsCard
                    itemsTotal={itemsTotal}
                    platformCharge={platformCharge}
                    deliveryCharge={deliveryCharge}
                    itemCount={totalQuantity}
                />
            </main>

            {/* DOCK BAR - ADDRESS & PAYMENT */}
            <div className="fixed bottom-0 left-0 right-0 max-w-3xl mx-auto z-40 bg-white">
                {/* DELIVERY ADDRESS BAR */}
                <DeliveryAddressCard
                    address={addressStr}
                    onOpenChangeAddress={openLocationPicker}
                />

                {/* PAYMENT + PLACE ORDER BUTTON */}
                <PaymentAndPlaceOrder
                    paymentMethod={paymentMethod}
                    onChangePaymentMethod={setPaymentMethod}
                    onPlaceOrder={handlePlaceOrder}
                    isPlacingOrder={placeOrderMutation.isPending}
                    disabled={cartItems.length === 0}
                />
            </div>

            {/* ORDER PLACED SUCCESS MODAL */}
            {successOrder && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl text-center space-y-5 border border-gray-100 transform transition-all duration-300 scale-100">
                        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-2 border border-green-100 shadow-inner">
                            <RiCheckboxCircleFill size={40} className="animate-bounce" />
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-gray-900">Order Placed Successfully!</h3>
                            <p className="text-gray-500 text-xs">Thank you for shopping. Your order has been registered.</p>
                        </div>

                        <div className="bg-gray-50/70 rounded-2xl p-4 border border-gray-100 text-left space-y-2 text-xs">
                            <div className="flex justify-between text-gray-600">
                                <span>Order Number:</span>
                                <span className="font-bold text-gray-900">{successOrder.order_no}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Invoice Number:</span>
                                <span className="font-bold text-gray-900">{successOrder.invoice_no}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Items Total:</span>
                                <span className="font-bold text-gray-900">₹{successOrder.items_total}</span>
                            </div>
                            {successOrder.discount_amount > 0 && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Discount Amount:</span>
                                    <span className="font-bold text-green-600">-₹{successOrder.discount_amount}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-600">
                                <span>Platform Charge:</span>
                                <span className="font-bold text-gray-900">₹{successOrder.platform_charge}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Charge:</span>
                                <span className="font-bold text-gray-900">
                                    {successOrder.delivery_charge === 0 ? "FREE" : `₹${successOrder.delivery_charge}`}
                                </span>
                            </div>
                            {successOrder.tax_amount > 0 && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax Amount:</span>
                                    <span className="font-bold text-gray-900">₹{successOrder.tax_amount}</span>
                                </div>
                            )}
                            <hr className="border-gray-200 my-1" />
                            <div className="flex justify-between text-gray-600">
                                <span>Grand Total Paid:</span>
                                <span className="font-bold text-purple-700">₹{successOrder.grand_total}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Payment Mode:</span>
                                <span className="font-bold text-gray-900">
                                    {successOrder.payment_method_label || 
                                     (successOrder.payment_method === 1 || successOrder.payment_method === "WALLET" ? "Bazaar Wallet" : 
                                      successOrder.payment_method === 2 || successOrder.payment_method === "ONLINE" ? "Online Payment" : 
                                      successOrder.payment_method === 3 || successOrder.payment_method === "COD" ? "Cash On Delivery (COD)" : 
                                      paymentMethod === "WALLET" ? "Bazaar Wallet" : 
                                      paymentMethod === "ONLINE" ? "Online Payment" : "Cash On Delivery (COD)")}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => {
                                    setSuccessOrder(null);
                                    router.push("/home");
                                }}
                                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white rounded-xl font-bold shadow-md transition text-xs"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
