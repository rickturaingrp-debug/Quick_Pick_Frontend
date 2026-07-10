import React, { useEffect, useState } from "react";
import { RiCloseLine, RiCircleFill, RiAddLine } from "react-icons/ri";
import { Product } from "@/types/product";
import { useProductDetails } from "@/hooks/product/useProductDetails";
import VariantSelector from "@/components/product-details/VariantSelector";

interface ProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    businessId: string | null;
    onAddToCart: (variantId: string | null, attributes: any) => void;
}

export default function ProductDetailsModal({
    isOpen,
    onClose,
    product,
    businessId,
    onAddToCart
}: ProductDetailsModalProps) {
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

    // Resolve businessId from the product object itself or fall back to the prop
    const resolvedBusinessId = product?.business?.business_id || businessId;

    // Fetch dynamic product details using the api query
    const { data: detailsData, isLoading, isError } = useProductDetails(
        product ? product.product_id : null,
        resolvedBusinessId
    );

    const productDetails = detailsData?.data;

    useEffect(() => {
        if (isOpen) {
            setSelectedVariantId(null);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, product]);

    if (!product) return null;

    // Use dynamic data when available, otherwise fall back to product prop
    const name = productDetails?.name || product.name;
    const isVeg = name.toLowerCase().includes("veg") && !name.toLowerCase().includes("non veg") && !name.toLowerCase().includes("non-veg");
    const indicatorBorderClass = isVeg ? "border-green-600" : "border-red-500";
    const indicatorIconClass = isVeg ? "text-green-600" : "text-red-500";

    // Resolve variant info
    const primaryVariant = productDetails?.variants?.find((v) => v.is_primary);
    const activeVariantId = selectedVariantId || primaryVariant?.variant_id || productDetails?.variants?.[0]?.variant_id || null;
    const activeVariant = productDetails?.variants?.find((v) => v.variant_id === activeVariantId) || null;

    const productImg = activeVariant?.images?.[0]?.image_medium || productDetails?.image || product.image;
    
    const price = Math.round(activeVariant?.final_price || productDetails?.final_price || product.final_price || product.selling_price);
    const mrp = activeVariant?.mrp || productDetails?.mrp || product.mrp || 0;

    const description = activeVariant?.long_description || 
                        activeVariant?.short_description || 
                        productDetails?.variants?.[0]?.long_description || 
                        null;

    const meta = activeVariant?.meta || null;
    const nutritionalInfo = (meta as any)?.nutritional_info || null;
    const allergens = (meta as any)?.allergens || null;

    const handleAddClick = () => {
        const attributesPayload = activeVariant?.attributes?.map((attr) => ({
            attribute_master_id: attr.attribute_id,
            attribute_value_id: attr.value_id,
        })) || null;
        onAddToCart(activeVariantId, attributesPayload);
    };

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
                            alt={name}
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
                    </div>

                    <div className="px-6 pt-2 pb-6 text-left">
                        {/* VEG / NON-VEG TAG */}
                        <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center mb-3 bg-white ${indicatorBorderClass} shadow`}>
                            <RiCircleFill size={10} className={indicatorIconClass} />
                        </div>

                        <h2 className="text-xl pb-4 border-b border-slate-100 font-bold text-gray-800 leading-tight mb-4">
                            {name}
                        </h2>
                        
                        {description && (
                            <>
                                <h4 className="font-bold text-gray-800 text-sm mb-2">Description</h4>
                                <div 
                                    className="text-gray-500 text-sm leading-relaxed mb-6 whitespace-pre-line"
                                    dangerouslySetInnerHTML={{ __html: description }}
                                />
                            </>
                        )}

                        {/* Loading indicator or dynamic features */}
                        {isLoading && (
                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 animate-pulse">
                                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                                <span>Loading details...</span>
                            </div>
                        )}

                        {/* Dynamic Variant Selector */}
                        {!isLoading && productDetails?.variants && productDetails.variants.length > 1 && (
                            <VariantSelector
                                variants={productDetails.variants}
                                activeVariant={activeVariant}
                                onSelectVariant={setSelectedVariantId}
                            />
                        )}

                        {/* More details */}
                        {(nutritionalInfo || allergens) && (
                            <div className="border-t border-gray-100 pt-6 mt-2 text-left">
                                {nutritionalInfo && (
                                    <>
                                        <h4 className="font-bold text-gray-800 text-sm mb-4">Nutritional Info</h4>
                                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                            {Object.entries(nutritionalInfo).map(([key, val]) => (
                                                <div key={key} className="flex justify-between text-sm mb-3 last:mb-0">
                                                    <span className="text-gray-500 capitalize">{key}</span>
                                                    <span className="font-semibold text-gray-800">{String(val)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {allergens && allergens.length > 0 && (
                                    <>
                                        <h4 className="font-bold text-gray-800 text-sm mb-3">Allergens</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {allergens.map((allergen: string) => (
                                                <span key={allergen} className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg border border-red-100">
                                                    {allergen}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Sticky Add to Cart Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center justify-between z-10 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] rounded-b-3xl">
                    <div>
                        <p className="text-[11px] text-gray-400 mb-0.5 font-bold uppercase tracking-wider text-left">Total Price</p>
                        <div className="flex items-baseline gap-2">
                            <span className="font-extrabold text-xl text-gray-800">₹{price}</span>
                            {mrp > price && (
                                <span className="text-xs text-gray-400 line-through">₹{mrp}</span>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={handleAddClick}
                        disabled={isLoading}
                        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-600/30 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                    >
                        Add Item
                        <RiAddLine size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
