import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getOrders } from "@/services/order.service";

export const useOrders = (userId: number, page: number = 1) => {
    return useQuery({
        queryKey: ["orders", userId, page],
        queryFn: () => getOrders(userId, page),
        enabled: !!userId,
    });
};

export const useInfiniteOrders = (
    userId: number,
    perPage: number = 10,
    search: string = "",
    orderStatus: string = ""
) => {
    return useInfiniteQuery({
        queryKey: ["orders", userId, "infinite", perPage, search, orderStatus],
        queryFn: ({ pageParam = 1 }) => getOrders(userId, pageParam as number, perPage, search, orderStatus),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.meta.current_page + 1;
            return nextPage <= lastPage.meta.last_page ? nextPage : undefined;
        },
        enabled: !!userId,
    });
};
