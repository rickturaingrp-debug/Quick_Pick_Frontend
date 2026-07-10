import { categoryApi } from "@/lib/axios";
import { VendorResponse } from "@/types/vendor";

export const getVendors = async (
    categoryId: string,
    subCategoryId?: string
): Promise<VendorResponse> => {
    const url = subCategoryId
        ? `/member/vendors?business_category_id=${categoryId}&business_sub_category_id=${subCategoryId}`
        : `/member/vendors?business_category_id=${categoryId}`;
    const { data } = await categoryApi.get<VendorResponse>(url);
    return data;
};
