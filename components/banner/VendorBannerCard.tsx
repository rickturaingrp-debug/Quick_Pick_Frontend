"use client";

import { useVendorBanners } from "@/hooks/banner/useBanners";

interface VendorBannerCardProps {
    businessId: string | null;
    bannerType: "main_banner" | "promotional_banner";
    className?: string;
    aspectRatioClass?: string;
}

export default function VendorBannerCard({
    businessId,
    bannerType,
    className = "px-4 pt-1",
    aspectRatioClass = "h-32 sm:h-52",
}: VendorBannerCardProps) {
    const { data: bannerData, isLoading } = useVendorBanners(businessId, bannerType);
    const banner = bannerData?.data?.[0];

    const bannerImage = banner?.image!;

    if (isLoading) {
        return (
            <div className={className}>
                <div className={`w-full rounded-lg bg-gray-200 animate-pulse ${aspectRatioClass}`} />
            </div>
        );
    }

    return (
        <div className={className}>
            <div className="overflow-hidden rounded-lg shadow-sm">
                <img
                    src={bannerImage}
                    alt={banner?.title || "Banner"}
                    className={`w-full object-cover ${aspectRatioClass}`}
                />
            </div>
        </div>
    );
}
