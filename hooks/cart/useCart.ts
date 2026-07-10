import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
} from "@/services/cart.service";
import { getProductDetails } from "@/services/product.service";
import { AddToCartPayload } from "@/types/cart";
import { showToast } from "@/utils/toast";

export const useCart = (userId: number) => {
    return useQuery({
        queryKey: ["cart", userId],
        queryFn: async () => {
            const response = await getCart(userId);
            if (response && response.data) {
                const resolvedItems = await Promise.all(
                    response.data.map(async (item) => {
                        const needsPrice = !item.product?.final_price || item.product?.final_price === 0;
                        const needsImage = !item.image || item.image === "";

                        if ((needsPrice || needsImage) && item.business?.id) {
                            try {
                                const detailsRes = await getProductDetails(item.product_id, item.business.id);
                                const details = detailsRes?.data;
                                if (details) {
                                    let resolvedPrice = details.final_price;
                                    let resolvedImage = details.image;

                                    if (item.product_variant_id) {
                                        const variant = details.variants?.find(
                                            (v) => v.variant_id === item.product_variant_id
                                        );
                                        if (variant) {
                                            resolvedPrice = variant.final_price;
                                            resolvedImage = variant.images?.[0]?.image_medium || resolvedImage;
                                        }
                                    }

                                    return {
                                        ...item,
                                        image: item.image || resolvedImage || null,
                                        product: {
                                            ...item.product,
                                            name: item.product?.name || details.name,
                                            final_price: item.product?.final_price || resolvedPrice || 0,
                                            image: item.product?.image || resolvedImage || null,
                                        }
                                    };
                                }
                            } catch (err) {
                                console.error("Failed to resolve product details for cart item:", item.product_id, err);
                            }
                        }
                        return item;
                    })
                );
                return {
                    ...response,
                    data: resolvedItems,
                };
            }
            return response;
        },
        enabled: !!userId,
    });
};

export const useAddToCart = (userId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: AddToCartPayload) => addToCart(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["cart", userId] });
            const res = data as any;
            const isSuccess = res?.success || res?.status || res?.success === undefined;
            if (isSuccess) {
                showToast.success(res?.message || "Product added to cart!");
            } else {
                const serverMessage = res?.message || "";
                if (
                    serverMessage.includes("another business") ||
                    serverMessage.includes("another restaurant") ||
                    res?.action_required === "clear_cart"
                ) {
                    showToast.error(
                        "Your cart contains items from another restaurant.\nYou can only order from one restaurant at a time. Clear your current cart to add items from this restaurant."
                    );
                } else {
                    showToast.error(serverMessage || "Failed to add product to cart.");
                }
            }
        },
        onError: (err: any) => {
            const serverMessage = err?.response?.data?.message || err?.message || "";
            if (
                serverMessage.includes("another business") ||
                serverMessage.includes("another restaurant") ||
                err?.response?.data?.action_required === "clear_cart"
            ) {
                showToast.error(
                    "Your cart contains items from another restaurant.\nYou can only order from one restaurant at a time. Clear your current cart to add items from this restaurant."
                );
            } else {
                showToast.error(serverMessage || "Failed to add product to cart.");
            }
        },
    });
};

export const useUpdateCart = (userId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ cartId, quantity }: { cartId: string; quantity: number }) =>
            updateCartItem(cartId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart", userId] });
        },
    });
};

export const useRemoveCartItem = (userId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cartId: string) => removeCartItem(cartId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["cart", userId] });
            const res = data as any;
            const isSuccess = res?.success || res?.status || res?.success === undefined;
            if (isSuccess) {
                showToast.success(res?.message || "Product removed from cart!");
            } else {
                showToast.error(res?.message || "Failed to remove product from cart.");
            }
        },
        onError: (err: any) => {
            showToast.error(err?.message || "Failed to remove product from cart.");
        },
    });
};

export const useClearCart = (userId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => clearCart(userId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["cart", userId] });
            const res = data as any;
            const isSuccess = res?.success || res?.status || res?.success === undefined;
            if (isSuccess) {
                showToast.success(res?.message || "Cart cleared successfully!");
            } else {
                showToast.error(res?.message || "Failed to clear cart.");
            }
        },
        onError: (err: any) => {
            showToast.error(err?.message || "Failed to clear cart.");
        },
    });
};
