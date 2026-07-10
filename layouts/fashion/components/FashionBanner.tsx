"use client";

import VendorBannerCard from "@/components/banner/VendorBannerCard";

interface FashionBannerProps {
    businessId: string | null;
}

export default function FashionBanner({ businessId }: FashionBannerProps) {
    return (
        <VendorBannerCard
            businessId={businessId}
            bannerType="main_banner"
            className="px-4 pt-1"
            aspectRatioClass="h-32 sm:h-52"
        />
    );
}
