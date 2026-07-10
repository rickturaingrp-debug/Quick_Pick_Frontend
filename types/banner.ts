export interface VendorBanner {
    id: string;
    business_id: string;
    banner_type: string;
    title: string;
    image: string | null;
    status: number;
    status_label: string;
    sort_order: number;
}

export interface VendorBannersResponse {
    status: boolean;
    message: string;
    data: VendorBanner[];
}
