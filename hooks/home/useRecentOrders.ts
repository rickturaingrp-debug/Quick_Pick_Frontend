import { useAuthContext } from "@/providers/AuthProvider";
import { useOrders } from "@/hooks/order/useOrders";

export function useRecentOrders() {
    const { userId } = useAuthContext();
    
    // Fetch orders if user is authenticated
    const { data: ordersRes, isLoading, isError } = useOrders(userId!, 1);
    const orders = ordersRes?.data || [];

    // Return the top 3 most recent orders
    const recentOrders = orders.slice(0, 3);

    return {
        orders: recentOrders,
        isLoading: isLoading && !!userId,
        isError,
    };
}
