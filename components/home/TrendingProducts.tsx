import React from "react";
import { useRouter } from "next/navigation";

interface TrendingProductsProps {
    products: any[];
    isLoading: boolean;
    cartQuantities: Record<string, number>;
    loadingProductId?: string | null;
    onAddQty: (id: string, bizId: string, name: string) => void;
    onIncQty: (compositeKey: string) => void;
    onDecQty: (compositeKey: string) => void;
}

export default function TrendingProducts({
    products,
    isLoading,
    cartQuantities,
    loadingProductId = null,
    onAddQty,
    onIncQty,
    onDecQty,
}: TrendingProductsProps) {
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="space-y-4 px-4 mt-8 text-left">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Trending Weekly</h3>
                <div className="flex gap-4 overflow-x-auto no-scrollbar">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="min-w-[170px] h-48 bg-zinc-200 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4 mt-8 font-sans">
            <div className="flex justify-between items-center px-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Trending Weekly</h3>
                <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">
                    {products.length} Items
                </span>
            </div>

            <div className="flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar">
                {products.map((prod) => {
                    const bizId = prod.business?.business_id || "";
                    const compositeKey = `${prod.product_id}-${bizId}`;
                    const qty = cartQuantities[compositeKey] || 0;
                    const finalPrice = prod.final_price || prod.selling_price || prod.mrp;
                    const discount = prod.discount || 0;
                    const isProductLoading = loadingProductId === compositeKey;

                    return (
                        <div
                            key={compositeKey}
                            className="min-w-[170px] max-w-[170px] bg-white border border-gray-100 rounded-md p-2 flex flex-col justify-between shadow-sm transition-all duration-300 relative group"
                        >
                            <div 
                                onClick={() => router.push(`/product/${prod.product_id}?business_id=${bizId}`)}
                                className="cursor-pointer text-left"
                            >
                                <div className="relative h-28 w-full overflow-hidden rounded-xl bg-gray-50 mb-2">
                                    <img
                                        src={prod.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"}
                                        alt={prod.name}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                    {discount > 0 && (
                                        <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                                            {discount}% OFF
                                        </div>
                                    )}
                                </div>

                                <p className="text-[10px] text-purple-700/80 font-bold uppercase tracking-wider leading-none">
                                    {prod.business?.business_name || "Bazaar Store"}
                                </p>
                                <h4 className="text-xs font-bold text-gray-800 line-clamp-1 mt-0.5">
                                    {prod.name}
                                </h4>

                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-sm font-extrabold text-gray-900">
                                        ₹{finalPrice}
                                    </span>
                                    {prod.selling_price && prod.selling_price > finalPrice && (
                                        <span className="text-[10px] text-gray-400 line-through">
                                            ₹{prod.selling_price}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Cart Action button */}
                            <div className="mt-3.5">
                                {isProductLoading ? (
                                    <button
                                        disabled
                                        className="w-full bg-purple-100 text-purple-700 rounded-lg py-1.5 text-[11px] font-bold shadow-sm h-7 flex items-center justify-center animate-pulse"
                                    >
                                        Updating...
                                    </button>
                                ) : qty > 0 ? (
                                    <div className="flex items-center justify-between bg-purple-700 text-white rounded-lg h-7 px-2">
                                        <button
                                            onClick={() => onDecQty(compositeKey)}
                                            className="text-xs font-extrabold h-full px-1.5 hover:bg-purple-800 rounded transition cursor-pointer"
                                        >
                                            -
                                        </button>
                                        <span className="text-xs font-bold">{qty}</span>
                                        <button
                                            onClick={() => onIncQty(compositeKey)}
                                            className="text-xs font-extrabold h-full px-1.5 hover:bg-purple-800 rounded transition cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => onAddQty(prod.product_id, bizId, prod.name)}
                                        className="w-full bg-purple-50 text-purple-700 hover:bg-purple-100 active:scale-[0.98] rounded-lg py-1.5 text-xs font-bold shadow-sm transition-all duration-150 cursor-pointer h-7 flex items-center justify-center"
                                    >
                                        Add to Cart
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
