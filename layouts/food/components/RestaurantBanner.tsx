"use client";

import React, { useMemo } from "react";
import Slider from "react-slick";
import { useVendorBanners } from "@/hooks/banner/useBanners";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface RestaurantBannerProps {
    businessId: string | null;
    shopPhoto: string;
}

export default function RestaurantBanner({ businessId, shopPhoto }: RestaurantBannerProps) {
    const { data: bannersResponse } = useVendorBanners(businessId, "main_banner");
    const banners = bannersResponse?.data || [];

    // Combine restaurant cover image and promotional banners
    const slides = useMemo(() => {
        const list: string[] = [];
        if (shopPhoto) {
            list.push(shopPhoto);
        }
        banners.forEach((b) => {
            if (b.image) {
                list.push(b.image);
            }
        });
        return list;
    }, [shopPhoto, banners]);

    const isSliderNeeded = slides.length > 1;

    const settings = {
        dots: isSliderNeeded,
        infinite: isSliderNeeded,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: isSliderNeeded,
        autoplaySpeed: 3500,
        arrows: false,
        fade: true,
        cssEase: "linear"
    };

    if (slides.length === 0) {
        return (
            <div className="h-48 sm:h-72 w-full bg-zinc-200 animate-pulse" />
        );
    }

    return (
        <section className="relative w-full overflow-hidden h-48 sm:h-72 bg-gray-50 food-banner-slider">
            {isSliderNeeded ? (
                <Slider {...settings} className="h-full w-full">
                    {slides.map((url, idx) => (
                        <div key={`${url}-${idx}`} className="h-48 sm:h-72 w-full relative outline-none">
                            <img
                                src={url || undefined}
                                className="h-48 sm:h-72 w-full object-cover select-none"
                                alt={`Banner ${idx + 1}`}
                            />
                        </div>
                    ))}
                </Slider>
            ) : (
                <img
                    src={slides[0] || undefined}
                    className="h-48 sm:h-72 w-full object-cover"
                    alt="Restaurant cover"
                />
            )}
        </section>
    );
}
