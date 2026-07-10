"use client";

import VendorBannerCard from "../banner/VendorBannerCard";

interface OfferBannerProps {
    businessId: string | null;
}

export default function OfferBanner({ businessId }: OfferBannerProps) {
    return (
        <VendorBannerCard
            businessId={businessId}
            bannerType="promotional_banner"
            className="px-4 mt-5"
            aspectRatioClass="h-40 sm:h-64"
        />
    );
}
