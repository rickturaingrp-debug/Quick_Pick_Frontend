import { useQuery } from "@tanstack/react-query";
import { getVendorBanners, getBanners } from "@/services/banner.service";

export const useVendorBanners = (
    businessId: string | null,
    bannerType: "main_banner" | "promotional_banner"
) => {
    return useQuery({
        queryKey: ["vendorBanners", businessId, bannerType],
        queryFn: () => getVendorBanners(businessId!, bannerType),
        enabled: !!businessId,
    });
};

export const useBanners = () => {
    return useQuery({
        queryKey: ["banners"],
        queryFn: () => getBanners(),
    });
};
