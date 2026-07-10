import React from "react";
import { RiMapPinLine } from "react-icons/ri";

interface RestaurantInfoCardProps {
    name: string;
    distance?: string;
    area?: string;
    deliveryTime?: string;
}

export default function RestaurantInfoCard({
    name,
    distance = "1 km",
    area = "Jodhpur Park",
    deliveryTime = "20–25 mins"
}: RestaurantInfoCardProps) {
    return (
        <div className="p-6 bg-white rounded-t-[2rem] -mt-6 shadow-[0px_-20px_30px_0px_rgba(0,0,0,0.1)] relative z-10 text-left">
            {/* RESTAURANT NAME */}
            <div className="flex justify-between items-start">
                <h1 className="text-2xl font-extrabold text-gray-800 leading-tight">
                    {name}
                </h1>
            </div>

            {/* LOCATION / META INFO */}
            <div className="flex items-center gap-1 text-gray-600 mt-2 pb-4 text-sm border-b border-gray-100 font-medium">
                <div className="flex gap-1 items-center">
                    <RiMapPinLine size={16} className="shrink-0" />
                    <span>{distance}</span>
                </div>
                <span className="w-1 h-1 bg-purple-500 rounded-full mx-1 shrink-0"></span>
                <span>{area}</span>
                <span className="w-1 h-1 bg-purple-500 rounded-full mx-1 shrink-0"></span>
                <span className="text-purple-600 font-semibold">{deliveryTime}</span>
            </div>
        </div>
    );
}
