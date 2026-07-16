import { categoryApi } from "@/lib/axios";
import { VendorBannersResponse, BannerResponse } from "@/types/banner";

export const getVendorBanners = async (
    businessId: string,
    bannerType: "main_banner" | "promotional_banner"
): Promise<VendorBannersResponse> => {
    const { data } = await categoryApi.get<VendorBannersResponse>(
        `/member/vendors/banners?business_id=${businessId}&banner_type=${bannerType}`
    );
    return data;
};

export const getBanners = async (): Promise<BannerResponse> => {
    const { data } = await categoryApi.get<BannerResponse>("/member/banners");
    return data;
};
