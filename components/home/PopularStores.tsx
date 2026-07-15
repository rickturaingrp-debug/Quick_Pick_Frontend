import React from "react";
import { useRouter } from "next/navigation";
import { RiTimeLine } from "react-icons/ri";

interface PopularStoresProps {
    vendors: any[];
    isLoading: boolean;
}

export default function PopularStores({ vendors, isLoading }: PopularStoresProps) {
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="space-y-4 px-4 mt-7 text-left">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Popular Stores Near You</h3>
                {[1, 2, 3].map((n) => (
                    <div key={n} className="h-24 bg-zinc-200 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (vendors.length === 0) {
        return null;
    }

    return (
        <div className="mt-6 px-4">
            <div className="mb-3">
                <h2 className="text-base font-bold text-slate-900">
                    Popular Stores
                </h2>
                <p className="text-[11px] text-slate-500">
                    Discover nearby stores
                </p>
            </div>

            <div className="space-y-2.5">
                {vendors.map((vendor) => {
                    const shopPhoto = vendor.kycdetail?.shop_photo?.url;

                    return (
                        <button
                            key={vendor.id}
                            onClick={() =>
                                router.push(
                                    `/category/${vendor.business_category_id}/subcategory/${vendor.business_sub_category_id}?vendorId=${vendor.id}`
                                )
                            }
                            className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 transition-colors hover:border-violet-200"
                        >
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                                <img
                                    src={shopPhoto}
                                    alt={vendor.business_name}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            <div className="min-w-0 flex-1 text-left">
                                <h3 className="truncate text-sm font-semibold text-slate-900 group-hover:text-violet-600">
                                    {vendor.business_name}
                                </h3>

                                <p className="mt-0.5 truncate text-xs text-slate-500">
                                    {vendor.category?.name}
                                    {vendor.sub_category?.name &&
                                        ` • ${vendor.sub_category.name}`}
                                </p>

                                <span className="mt-2 inline-flex rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700">
                            Open Now
                        </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
