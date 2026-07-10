import React, { useEffect } from "react";
import { RiCloseLine, RiCircleFill, RiAddLine } from "react-icons/ri";
import { Product } from "@/types/product";

interface ProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onAddToCart: () => void;
}

export default function ProductDetailsModal({
    isOpen,
    onClose,
    product,
    onAddToCart
}: ProductDetailsModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!product) return null;

    const isVeg = product.name.toLowerCase().includes("veg") && !product.name.toLowerCase().includes("non veg") && !product.name.toLowerCase().includes("non-veg");
    const indicatorBorderClass = isVeg ? "border-green-600" : "border-red-500";
    const indicatorIconClass = isVeg ? "text-green-600" : "text-red-500";
    
    const productImg = product.image!;
    const price = Math.round(product.final_price || product.selling_price);

    // Close on overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            onClick={handleOverlayClick}
            className={`fixed inset-0 z-[100] bg-black/60 transition-all duration-300 ${
                isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
            }`}
        >
            <div 
                className={`absolute bottom-0 left-0 right-0 max-w-3xl mx-auto bg-white rounded-t-3xl transition-transform duration-300 flex flex-col h-[80vh] shadow-2xl ${
                    isOpen ? "translate-y-0" : "translate-y-full"
                }`}
            >
                {/* Sticky Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 shadow-md hover:bg-gray-100 transition active:scale-95 cursor-pointer"
                    aria-label="Close details"
                >
                    <RiCloseLine size={20} />
                </button>

                {/* Scrollable Area */}
                <div className="overflow-y-auto pb-28 rounded-t-3xl no-scrollbar flex-1">
                    {/* Image Header */}
                    <div className="relative w-full h-64 shrink-0">
                        <img 
                            src={productImg || undefined} 
                            className="w-full h-full object-cover" 
                            alt={product.name}
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="px-6 pt-2 pb-6 text-left">
                        {/* VEG / NON-VEG TAG */}
                        <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center mb-3 bg-white ${indicatorBorderClass} shadow`}>
                            <RiCircleFill size={10} className={indicatorIconClass} />
                        </div>

                        <h2 className="text-xl pb-4 border-b border-slate-100 font-bold text-gray-800 leading-tight mb-4">
                            {product.name}
                        </h2>
                        
                        <h4 className="font-bold text-gray-800 text-sm mb-2">Description</h4>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            {product.primary_variant?.long_description || 
                             product.primary_variant?.short_description ||
                             `Enjoy our premium chef-crafted recipe prepared with carefully sourced fresh ingredients. Steamed, baked or fried to perfection for an incredible taste that guarantees satisfaction.`}
                        </p>

                        {/* More details */}
                        <div className="border-t border-gray-100 pt-6 mt-2">
                            <h4 className="font-bold text-gray-800 text-sm mb-4">Nutritional Info</h4>
                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <div className="flex justify-between text-sm mb-3">
                                    <span className="text-gray-500">Energy</span>
                                    <span className="font-semibold text-gray-800">320 kcal</span>
                                </div>
                                <div className="flex justify-between text-sm mb-3">
                                    <span className="text-gray-500">Protein</span>
                                    <span className="font-semibold text-gray-800">14g</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Carbohydrates</span>
                                    <span className="font-semibold text-gray-800">45g</span>
                                </div>
                            </div>

                            <h4 className="font-bold text-gray-800 text-sm mb-3">Allergens</h4>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg border border-red-100">Wheat</span>
                                <span className="px-3 py-1.5 bg-yellow-50 text-yellow-600 text-xs font-medium rounded-lg border border-yellow-100">Soy</span>
                                <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg border border-blue-100">Dairy</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Sticky Add to Cart Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center justify-between z-10 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] rounded-b-3xl">
                    <div>
                        <p className="text-[11px] text-gray-400 mb-0.5 font-bold uppercase tracking-wider text-left">Total Price</p>
                        <div className="font-extrabold text-xl text-gray-800">₹{price}</div>
                    </div>
                    <button 
                        onClick={onAddToCart}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-600/30 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                    >
                        Add Item
                        <RiAddLine size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
