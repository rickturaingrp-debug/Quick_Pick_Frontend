import React from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import CategoryCard from "./CategoryCard";

interface CategoriesSectionProps {
    categories: any[];
    isLoading: boolean;
    isError: boolean;
}

export default function CategoriesSection({
    categories,
    isLoading,
    isError,
}: CategoriesSectionProps) {
    return (
        <div className="mt-7 px-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Shop by Category</h3>
                <Link
                    href="/category"
                    className="text-xs font-bold text-purple-600 hover:text-purple-800 transition flex items-center gap-0.5"
                >
                    View All <FiArrowRight />
                </Link>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="h-32 bg-zinc-200 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : isError ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-center text-xs text-red-500">
                    Failed to load categories.
                </div>
            ) : categories.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-xs text-zinc-500">
                    No categories available.
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {categories.slice(0, 4).map((item) => (
                        <CategoryCard
                            key={item.id}
                            category={{
                                id: item.id,
                                title: item.name,
                                image: item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60",
                                href: `/category/${item.id}`,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
