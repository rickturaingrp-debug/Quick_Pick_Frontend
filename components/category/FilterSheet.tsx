"use client";

import { useState } from "react";

export interface FilterState {
    sortBy: string;
    categories: string[];
    sizes: string[];
    priceRange: { min: string; max: string };
    color: string;
    fabrics: string[];
}

interface FilterSheetProps {
    open: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    categories?: string[];
    sizes?: string[];
    colors?: { name: string; color_code: string }[];
    fabrics?: string[];
}

export default function FilterSheet({
    open,
    onClose,
    onApply,
    categories = [],
    sizes = [],
    colors = [],
    fabrics = []
}: FilterSheetProps) {
    const [sortBy, setSortBy] = useState("popularity");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);

    const toggleCategory = (cat: string) => {
        setSelectedCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };

    const toggleSize = (size: string) => {
        setSelectedSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };

    const toggleFabric = (fabric: string) => {
        setSelectedFabrics((prev) =>
            prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric]
        );
    };

    const handleReset = () => {
        setSortBy("popularity");
        setSelectedCategories([]);
        setSelectedSizes([]);
        setMinPrice("");
        setMaxPrice("");
        setSelectedColor("");
        setSelectedFabrics([]);
    };

    const handleApply = () => {
        onApply({
            sortBy,
            categories: selectedCategories,
            sizes: selectedSizes,
            priceRange: { min: minPrice, max: maxPrice },
            color: selectedColor,
            fabrics: selectedFabrics,
        });
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300 ${
                    open ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            />

            {/* Bottom Sheet */}
            <div
                className={`fixed left-0 bottom-0 z-50 w-full rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 h-[70vh] flex flex-col ${
                    open ? "translate-y-0" : "translate-y-full"
                }`}
            >
                {/* Drag Handle */}
                <div className="flex justify-center py-3 flex-shrink-0">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                </div>

                {/* Header */}
                <div className="px-5 pb-3 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
                    <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
                    <button onClick={handleReset} className="text-sm font-medium text-purple-600">
                        Reset
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
                    {/* Sort */}
                    <div>
                        <h4 className="font-medium mb-3 text-sm text-gray-800">Sort By</h4>
                        <div className="space-y-2">
                            {["popularity", "newest", "price_low_high", "price_high_low"].map((option) => {
                                const labels: Record<string, string> = {
                                    popularity: "Popularity",
                                    newest: "Newest First",
                                    price_low_high: "Price: Low to High",
                                    price_high_low: "Price: High to Low",
                                };
                                return (
                                    <label
                                        key={option}
                                        className="flex items-center justify-between border border-slate-100 rounded-xl px-3 py-3 text-sm cursor-pointer hover:bg-gray-50"
                                    >
                                        <span>{labels[option]}</span>
                                        <input
                                            type="radio"
                                            name="sort"
                                            checked={sortBy === option}
                                            onChange={() => setSortBy(option)}
                                            className="accent-purple-600 h-4 w-4"
                                        />
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Category */}
                    {categories.length > 0 && (
                        <div>
                            <h4 className="font-medium mb-3 text-sm text-gray-800">Category</h4>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => {
                                    const active = selectedCategories.includes(cat);
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => toggleCategory(cat)}
                                            className={`px-4 py-2 text-sm border rounded-full transition ${
                                                active
                                                    ? "bg-purple-600 text-white border-purple-600"
                                                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Size */}
                    {sizes.length > 0 && (
                        <div>
                            <h4 className="font-medium mb-3 text-sm text-gray-800">Size</h4>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((size) => {
                                    const active = selectedSizes.includes(size);
                                    return (
                                        <button
                                            key={size}
                                            onClick={() => toggleSize(size)}
                                            className={`px-4 py-2 text-sm border rounded-full transition ${
                                                active
                                                    ? "bg-purple-600 text-white border-purple-600"
                                                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Price Range */}
                    <div>
                        <h4 className="font-medium mb-3 text-sm text-gray-800">Price Range</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="number"
                                placeholder="Min ₹"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full border rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-200 border-gray-200"
                            />
                            <input
                                type="number"
                                placeholder="Max ₹"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full border rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-200 border-gray-200"
                            />
                        </div>
                    </div>

                    {/* Color */}
                    {colors.length > 0 && (
                        <div>
                            <h4 className="font-medium mb-3 text-sm text-gray-800">Color</h4>
                            <div className="flex flex-wrap gap-3">
                                {colors.map((color) => {
                                    const active = selectedColor === color.name;
                                    const isWhite = color.name.toLowerCase() === "white" || color.color_code?.toLowerCase() === "#ffffff" || color.color_code?.toLowerCase() === "#fff";
                                    return (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            style={{ backgroundColor: color.color_code || color.name }}
                                            className={`w-8 h-8 rounded-full border-2 transition ${
                                                active
                                                    ? "border-purple-600 scale-110 shadow-md"
                                                    : isWhite
                                                    ? "border-gray-300 hover:scale-105"
                                                    : "border-gray-200 hover:scale-105"
                                            }`}
                                            title={color.name}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Fabric */}
                    {fabrics.length > 0 && (
                        <div>
                            <h4 className="font-medium mb-3 text-sm text-gray-800">Fabric</h4>
                            <div className="flex flex-wrap gap-2">
                                {fabrics.map((fabric) => {
                                    const active = selectedFabrics.includes(fabric);
                                    return (
                                        <button
                                            key={fabric}
                                            onClick={() => toggleFabric(fabric)}
                                            className={`px-4 py-2 text-sm border rounded-full transition ${
                                                active
                                                    ? "bg-purple-600 text-white border-purple-600"
                                                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            {fabric}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-white flex-shrink-0">
                    <button
                        onClick={handleApply}
                        className="w-full bg-purple-600 hover:bg-purple-700 transition text-white py-3 rounded-2xl font-medium text-sm"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </>
    );
}
