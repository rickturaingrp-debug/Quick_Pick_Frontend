import { useState, useEffect, useMemo } from "react";
import { useVendors } from "@/hooks/vendor/useVendors";
import { useProducts } from "@/hooks/product/useProducts";
import { useCart, useAddToCart, useUpdateCart, useRemoveCartItem } from "@/hooks/cart/useCart";
import { useAuthContext } from "@/providers/AuthProvider";
import { showToast } from "@/utils/toast";

export function useTrendingProducts(categories: any[]) {
    const { userId } = useAuthContext();
    
    // Fetch cart data from server
    const { data: cartResponse } = useCart(userId!);
    const cartItems = cartResponse?.data || [];

    // Track active loading state per composite product key
    const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

    // Fetch primary vendors for top 8 active categories to make sure all categories (like Fashion) are covered
    const cat1Id = categories[0]?.id || "";
    const cat2Id = categories[1]?.id || "";
    const cat3Id = categories[2]?.id || "";
    const cat4Id = categories[3]?.id || "";
    const cat5Id = categories[4]?.id || "";
    const cat6Id = categories[5]?.id || "";
    const cat7Id = categories[6]?.id || "";
    const cat8Id = categories[7]?.id || "";

    const { data: v1, isLoading: iv1 } = useVendors(cat1Id);
    const { data: v2, isLoading: iv2 } = useVendors(cat2Id);
    const { data: v3, isLoading: iv3 } = useVendors(cat3Id);
    const { data: v4, isLoading: iv4 } = useVendors(cat4Id);
    const { data: v5, isLoading: iv5 } = useVendors(cat5Id);
    const { data: v6, isLoading: iv6 } = useVendors(cat6Id);
    const { data: v7, isLoading: iv7 } = useVendors(cat7Id);
    const { data: v8, isLoading: iv8 } = useVendors(cat8Id);

    const vendor1Id = v1?.data?.[0]?.id || "";
    const vendor2Id = v2?.data?.[0]?.id || "";
    const vendor3Id = v3?.data?.[0]?.id || "";
    const vendor4Id = v4?.data?.[0]?.id || "";
    const vendor5Id = v5?.data?.[0]?.id || "";
    const vendor6Id = v6?.data?.[0]?.id || "";
    const vendor7Id = v7?.data?.[0]?.id || "";
    const vendor8Id = v8?.data?.[0]?.id || "";

    // Fetch active products for the primary vendor of each category
    const { data: p1, isLoading: ip1 } = useProducts(vendor1Id);
    const { data: p2, isLoading: ip2 } = useProducts(vendor2Id);
    const { data: p3, isLoading: ip3 } = useProducts(vendor3Id);
    const { data: p4, isLoading: ip4 } = useProducts(vendor4Id);
    const { data: p5, isLoading: ip5 } = useProducts(vendor5Id);
    const { data: p6, isLoading: ip6 } = useProducts(vendor6Id);
    const { data: p7, isLoading: ip7 } = useProducts(vendor7Id);
    const { data: p8, isLoading: ip8 } = useProducts(vendor8Id);

    const products1 = p1?.data || [];
    const products2 = p2?.data || [];
    const products3 = p3?.data || [];
    const products4 = p4?.data || [];
    const products5 = p5?.data || [];
    const products6 = p6?.data || [];
    const products7 = p7?.data || [];
    const products8 = p8?.data || [];

    // Combine products
    const combinedProducts = [
        ...products1,
        ...products2,
        ...products3,
        ...products4,
        ...products5,
        ...products6,
        ...products7,
        ...products8,
    ];
    
    // De-duplicate using a composite key: product_id + business_id
    const uniqueProducts: any[] = [];
    const seenCompositeKeys = new Set<string>();

    for (const prod of combinedProducts) {
        if (prod && prod.product_id) {
            const bizId = prod.business?.business_id || "";
            const compositeKey = `${prod.product_id}-${bizId}`;
            if (!seenCompositeKeys.has(compositeKey)) {
                seenCompositeKeys.add(compositeKey);
                uniqueProducts.push(prod);
            }
        }
    }

    // Map compositeKeys (product_id-business_id) to quantities and cart item IDs from the server
    const cartQuantitiesMap = useMemo(() => {
        const map: Record<string, { quantity: number; cartItemId: string }> = {};
        cartItems.forEach((item: any) => {
            if (item.product_id) {
                const bizId = item.business?.id || item.business?.business_id || "";
                const compositeKey = `${item.product_id}-${bizId}`;
                map[compositeKey] = {
                    quantity: item.quantity,
                    cartItemId: item.id,
                };
            }
        });
        return map;
    }, [cartItems]);

    // Format to Record<string, number> using composite keys
    const cartQuantities = useMemo(() => {
        const record: Record<string, number> = {};
        Object.entries(cartQuantitiesMap).forEach(([compositeKey, info]) => {
            record[compositeKey] = info.quantity;
        });
        return record;
    }, [cartQuantitiesMap]);

    // Cart actions using Mutations
    const addToCartMutation = useAddToCart(userId!);
    const updateCartMutation = useUpdateCart(userId!);
    const removeCartItemMutation = useRemoveCartItem(userId!);

    const handleAddQty = async (id: string, bizId: string, name: string) => {
        if (!userId) {
            showToast.error("Please login to add items to your cart.");
            return;
        }

        const prod = uniqueProducts.find(
            (p) => p.product_id === id && (p.business?.business_id === bizId || p.business?.id === bizId)
        );
        const catId = prod?.business_category_id || prod?.category_id || "";

        if (!bizId) {
            showToast.error("Merchant details not found for this product.");
            return;
        }

        const compositeKey = `${id}-${bizId}`;
        setLoadingProductId(compositeKey);
        try {
            await addToCartMutation.mutateAsync({
                user_id: userId,
                business_id: bizId,
                business_category_id: catId,
                product_id: id,
                quantity: 1,
            });
        } catch (err) {
            console.error("Error adding to cart:", err);
        } finally {
            setLoadingProductId(null);
        }
    };

    const handleIncQty = async (compositeKey: string) => {
        const itemInfo = cartQuantitiesMap[compositeKey];
        if (!itemInfo) return;

        setLoadingProductId(compositeKey);
        try {
            await updateCartMutation.mutateAsync({
                cartId: itemInfo.cartItemId,
                quantity: itemInfo.quantity + 1,
            });
        } catch (err) {
            console.error("Error incrementing quantity:", err);
        } finally {
            setLoadingProductId(null);
        }
    };

    const handleDecQty = async (compositeKey: string) => {
        const itemInfo = cartQuantitiesMap[compositeKey];
        if (!itemInfo) return;

        setLoadingProductId(compositeKey);
        try {
            if (itemInfo.quantity <= 1) {
                await removeCartItemMutation.mutateAsync(itemInfo.cartItemId);
            } else {
                await updateCartMutation.mutateAsync({
                    cartId: itemInfo.cartItemId,
                    quantity: itemInfo.quantity - 1,
                });
            }
        } catch (err) {
            console.error("Error decrementing quantity:", err);
        } finally {
            setLoadingProductId(null);
        }
    };

    return {
        products: uniqueProducts,
        isLoading:
            (iv1 && !!cat1Id) ||
            (iv2 && !!cat2Id) ||
            (iv3 && !!cat3Id) ||
            (iv4 && !!cat4Id) ||
            (iv5 && !!cat5Id) ||
            (iv6 && !!cat6Id) ||
            (iv7 && !!cat7Id) ||
            (iv8 && !!cat8Id) ||
            (ip1 && !!vendor1Id) ||
            (ip2 && !!vendor2Id) ||
            (ip3 && !!vendor3Id) ||
            (ip4 && !!vendor4Id) ||
            (ip5 && !!vendor5Id) ||
            (ip6 && !!vendor6Id) ||
            (ip7 && !!vendor7Id) ||
            (ip8 && !!vendor8Id),
        cartQuantities,
        loadingProductId,
        handleAddQty,
        handleIncQty,
        handleDecQty,
    };
}
