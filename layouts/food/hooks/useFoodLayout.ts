import { useState, useMemo } from "react";
import { useCart, useAddToCart, useUpdateCart, useRemoveCartItem } from "@/hooks/cart/useCart";
import { useAuthContext } from "@/providers/AuthProvider";
import { formatAddress } from "@/utils/address";
import { Product } from "@/types/product";
import { Vendor } from "@/types/vendor";

export const useFoodLayout = (
    categoryId: string,
    activeVendorId: string | null,
    vendors: Vendor[]
) => {
    const { userId, selectedAddress } = useAuthContext();
    const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Cart Hooks
    const { data: cartResponse } = useCart(userId!);
    const addToCartMutation = useAddToCart(userId!);
    const updateCartMutation = useUpdateCart(userId!);
    const removeCartItemMutation = useRemoveCartItem(userId!);

    const cartItems = cartResponse?.data || [];

    // Map product_id to cart quantity and cart item ID for fast lookup
    const cartMap = useMemo(() => {
        const map = new Map<string, { quantity: number; cartItemId: string }>();
        cartItems.forEach((item) => {
            map.set(item.product_id, {
                quantity: item.quantity,
                cartItemId: item.id,
            });
        });
        return map;
    }, [cartItems]);

    const totalItemsInCart = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + item.quantity, 0);
    }, [cartItems]);

    // Cart actions
    const handleAdd = (product: Product) => {
        if (!activeVendorId) return;
        addToCartMutation.mutate({
            user_id: userId!,
            business_id: activeVendorId,
            business_category_id: categoryId,
            product_id: product.product_id,
            product_variant_id: product.primary_variant?.variant_id || undefined,
            quantity: 1,
        });
    };

    const handleIncrement = (productId: string, cartItemId: string, currentQty: number) => {
        updateCartMutation.mutate({
            cartId: cartItemId,
            quantity: currentQty + 1,
        });
    };

    const handleDecrement = (productId: string, cartItemId: string, currentQty: number) => {
        if (currentQty > 1) {
            updateCartMutation.mutate({
                cartId: cartItemId,
                quantity: currentQty - 1,
            });
        } else {
            removeCartItemMutation.mutate(cartItemId);
        }
    };

    const handleModalAdd = (variantId?: string | null, attributes?: any) => {
        if (!selectedProductForModal) return;
        
        const finalVariantId = variantId || selectedProductForModal.primary_variant?.variant_id || null;

        const cartItemInfo = cartItems.find(
            (item) => item.product_id === selectedProductForModal.product_id && 
                      (!finalVariantId || item.product_variant_id === finalVariantId)
        );

        if (cartItemInfo) {
            handleIncrement(selectedProductForModal.product_id, cartItemInfo.id, cartItemInfo.quantity);
        } else {
            if (!activeVendorId) return;
            addToCartMutation.mutate({
                user_id: userId!,
                business_id: activeVendorId,
                business_category_id: categoryId,
                product_id: selectedProductForModal.product_id,
                product_variant_id: finalVariantId || undefined,
                quantity: 1,
                attributes: attributes || null,
            });
        }
        setIsModalOpen(false);
    };

    // Find active vendor details
    const activeVendor = vendors.find((v) => v.id === activeVendorId) || vendors[0];
    const shopPhoto = activeVendor?.kycdetail?.shop_photo?.url!;
    const restaurantName = activeVendor?.business_name || "";
    const addressText = selectedAddress ? formatAddress(selectedAddress) : "Katju Nagar, Kolkata - 700032";

    return {
        selectedProductForModal,
        setSelectedProductForModal,
        isModalOpen,
        setIsModalOpen,
        cartMap,
        totalItemsInCart,
        handleAdd,
        handleIncrement,
        handleDecrement,
        handleModalAdd,
        activeVendor,
        shopPhoto,
        restaurantName,
        addressText,
    };
};
