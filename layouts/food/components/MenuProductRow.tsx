import React from "react";
import { RiCircleFill, RiSubtractLine, RiAddLine } from "react-icons/ri";
import { Product } from "@/types/product";

interface MenuProductRowProps {
    product: Product;
    quantityInCart: number;
    onAdd: () => void;
    onIncrement: () => void;
    onDecrement: () => void;
    onClickRow: () => void;
}

export default function MenuProductRow({
    product,
    quantityInCart,
    onAdd,
    onIncrement,
    onDecrement,
    onClickRow
}: MenuProductRowProps) {
    const isVeg = product.name.toLowerCase().includes("veg") && !product.name.toLowerCase().includes("non veg") && !product.name.toLowerCase().includes("non-veg");
    const indicatorBorderClass = isVeg ? "border-green-600" : "border-red-500";
    const indicatorIconClass = isVeg ? "text-green-600" : "text-red-500";

    const productImg = product.image!;

    return (
        <div 
            onClick={onClickRow}
            className="flex justify-between gap-4 border-b border-gray-100 pb-8 pt-6 cursor-pointer hover:bg-gray-50/40 px-6 transition text-left"
        >
            {/* LEFT CONTENT */}
            <div className="flex-1 min-w-0">
                <h3 className="font-bold leading-snug text-gray-800 text-[15px] overflow-hidden line-clamp-2">
                    {product.name}
                </h3>
                <p className="text-xs mt-2 text-gray-550 text-gray-500 leading-relaxed overflow-hidden line-clamp-2 font-normal">
                    {product.primary_variant?.short_description || 
                     `Delicious fresh item prepared with quality ingredients. Perfect choice for a satisfying food experience.`}
                </p>
                <p className="font-extrabold text-gray-800 mt-3 text-lg">
                    ₹{Math.round(product.final_price || product.selling_price)}
                </p>
            </div>

            {/* RIGHT IMAGE & BUTTON */}
            <div className="relative w-36 shrink-0" onClick={(e) => e.stopPropagation()}>
                <div className="relative">
                    <img 
                        src={productImg || undefined} 
                        alt={product.name}
                        className="w-36 h-32 object-cover rounded-xl shadow-sm animate-fade-in" 
                    />

                    {/* VEG / NON-VEG CORNER TAG */}
                    <div className={`absolute top-3 right-3 w-5 h-5 border-2 bg-white ${indicatorBorderClass} rounded-md flex items-center justify-center shadow`}>
                        <RiCircleFill size={10} className={indicatorIconClass} />
                    </div>

                    {/* CART ACTIONS BUTTON */}
                    <div className="absolute z-10 -bottom-3 left-1/2 -translate-x-1/2 w-[110px]">
                        {quantityInCart > 0 ? (
                            <div className="flex items-center justify-between bg-purple-600 text-white rounded-lg overflow-hidden shadow-md h-8 px-1">
                                <button 
                                    onClick={onDecrement}
                                    className="px-2 py-1 hover:bg-purple-705 active:scale-90 transition cursor-pointer"
                                    aria-label="Decrease quantity"
                                >
                                    <RiSubtractLine size={14} />
                                </button>
                                <span className="font-semibold text-sm px-1 min-w-[20px] text-center">
                                    {quantityInCart}
                                </span>
                                <button 
                                    onClick={onIncrement}
                                    className="px-2 py-1 hover:bg-purple-705 active:scale-90 transition cursor-pointer"
                                    aria-label="Increase quantity"
                                >
                                    <RiAddLine size={14} />
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={onAdd}
                                className="w-full bg-white border border-purple-600 hover:bg-purple-50 text-purple-600 font-bold py-1 px-3 rounded-lg text-sm shadow-md transition active:scale-95 cursor-pointer h-8"
                            >
                                ADD
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
