import React from "react";
import { ProductAttribute } from "@/types/product";

interface SpecsTableProps {
    attributes?: ProductAttribute[];
    sku?: string | null;
    barcode?: string | null;
    totalStock?: number | null;
    manufactureDate?: string | null;
    expiryDate?: string | null;
}

export default function SpecsTable({
    attributes = [],
    sku,
    barcode,
    totalStock,
    manufactureDate,
    expiryDate,
}: SpecsTableProps) {
    const specs: { label: string; value: string }[] = [];

    // Add attributes if available
    attributes.forEach((attr) => {
        if (attr.value && attr.value.trim()) {
            specs.push({ label: attr.attribute_name, value: attr.value });
        }
    });

    // Add API fields conditionally
    if (sku && sku.trim()) {
        specs.push({ label: "SKU / Code", value: sku });
    }
    if (barcode && barcode.trim()) {
        specs.push({ label: "Barcode", value: barcode });
    }
    if (totalStock !== undefined && totalStock !== null && totalStock > 0) {
        specs.push({ label: "Stock Available", value: `${totalStock} units` });
    }
    if (manufactureDate && manufactureDate.trim()) {
        specs.push({ label: "Manufacture Date", value: manufactureDate });
    }
    if (expiryDate && expiryDate.trim()) {
        specs.push({ label: "Expiry Date", value: expiryDate });
    }

    if (specs.length === 0) return null;

    return (
        <div className="pt-5 border-b border-slate-100 pb-5">
            <h3 className="font-bold text-gray-900 mb-3 text-left">Specifications</h3>
            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-white">
                <table className="w-full text-sm text-left text-gray-700">
                    <tbody>
                        {specs.map((spec, index) => (
                            <tr
                                key={index}
                                className={index < specs.length - 1 ? "border-b border-gray-200" : ""}
                            >
                                <td className="w-[38%] bg-gray-50 px-4 py-3 font-semibold text-gray-800 border-r border-gray-200/50">
                                    {spec.label}
                                </td>
                                <td className="px-4 py-3 text-gray-600 font-medium text-left">{spec.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
