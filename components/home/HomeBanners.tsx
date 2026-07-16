"use client";

import React, { useMemo } from "react";
import Slider from "react-slick";
import { useBanners } from "@/hooks/banner/useBanners";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HomeBanners() {
    const { data: response, isLoading, isError } = useBanners();

    // Filter and sort active banners
    const banners = useMemo(() => {
        if (!response?.data) return [];
        return response.data
            .filter((b) => b.status && b.image)
            .sort((a, b) => a.sort_order - b.sort_order);
    }, [response]);

    const isSliderNeeded = banners.length > 1;

    const settings = {
        dots: isSliderNeeded,
        infinite: isSliderNeeded,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: isSliderNeeded,
        autoplaySpeed: 4000,
        arrows: false,
        dotsClass: "slick-dots",
        pauseOnHover: true,
        swipeToSlide: true,
    };

    if (isLoading) {
        return (
            <div className="mt-4 px-4">
                <div className="h-40 w-full animate-pulse rounded-2xl bg-slate-200 sm:h-56 md:h-64" />
            </div>
        );
    }

    if (isError || banners.length === 0) {
        return null;
    }

    return (
        <section className="relative mt-4 px-4 home-banner-slider">
            {/* Override slick carousel dot styles for premium pill indicators */}
            <style>{`
                .home-banner-slider .slick-dots {
                    display: flex !important;
                    justify-content: center;
                    align-items: center;
                    gap: 6px;
                    bottom: 12px !important;
                    left: 0;
                    right: 0;
                    margin: 0 auto;
                    padding: 0;
                    list-style: none;
                }
                .home-banner-slider .slick-dots li {
                    width: auto !important;
                    height: auto !important;
                    margin: 0 !important;
                    display: inline-flex;
                    align-items: center;
                }
                .home-banner-slider .slick-dots li button {
                    width: 6px !important;
                    height: 6px !important;
                    padding: 0 !important;
                    border-radius: 9999px !important;
                    background-color: #cbd5e1 !important; /* Subtle gray (slate-300) for inactive */
                    opacity: 0.7 !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                .home-banner-slider .slick-dots li button:before {
                    display: none !important;
                }
                .home-banner-slider .slick-dots li.slick-active button {
                    width: 18px !important; /* Pill-shaped active dot */
                    background-color: #9333ea !important; /* Application's primary brand color (purple-600) */
                    opacity: 1 !important;
                    border-radius: 4px !important;
                }
            `}</style>

            <div className="overflow-hidden rounded-2xl ">
                {isSliderNeeded ? (
                    <Slider {...settings} className="w-full">
                        {banners.map((banner) => (
                            <div 
                                key={banner.id} 
                                className="relative h-40 w-full outline-none sm:h-56 md:h-64"
                            >
                                <img
                                    src={banner.image || undefined}
                                    alt={banner.title || "Banner"}
                                    className="h-full w-full object-cover select-none"
                                    loading="eager"
                                />
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <div className="relative h-40 w-full sm:h-56 md:h-64">
                        <img
                            src={banners[0].image || undefined}
                            alt={banners[0].title || "Banner"}
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
