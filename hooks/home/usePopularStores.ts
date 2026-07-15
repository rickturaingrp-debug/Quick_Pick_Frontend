import { useVendors } from "@/hooks/vendor/useVendors";

export function usePopularStores(categories: any[]) {
    // Dynamic query for vendors under the first 8 active categories
    const cat1Id = categories[0]?.id || "";
    const cat2Id = categories[1]?.id || "";
    const cat3Id = categories[2]?.id || "";
    const cat4Id = categories[3]?.id || "";
    const cat5Id = categories[4]?.id || "";
    const cat6Id = categories[5]?.id || "";
    const cat7Id = categories[6]?.id || "";
    const cat8Id = categories[7]?.id || "";

    const { data: vendors1Res, isLoading: isLoading1 } = useVendors(cat1Id);
    const { data: vendors2Res, isLoading: isLoading2 } = useVendors(cat2Id);
    const { data: vendors3Res, isLoading: isLoading3 } = useVendors(cat3Id);
    const { data: vendors4Res, isLoading: isLoading4 } = useVendors(cat4Id);
    const { data: vendors5Res, isLoading: isLoading5 } = useVendors(cat5Id);
    const { data: vendors6Res, isLoading: isLoading6 } = useVendors(cat6Id);
    const { data: vendors7Res, isLoading: isLoading7 } = useVendors(cat7Id);
    const { data: vendors8Res, isLoading: isLoading8 } = useVendors(cat8Id);

    const vendors1 = vendors1Res?.data || [];
    const vendors2 = vendors2Res?.data || [];
    const vendors3 = vendors3Res?.data || [];
    const vendors4 = vendors4Res?.data || [];
    const vendors5 = vendors5Res?.data || [];
    const vendors6 = vendors6Res?.data || [];
    const vendors7 = vendors7Res?.data || [];
    const vendors8 = vendors8Res?.data || [];

    // Interleave, merge, and de-duplicate merchants by ID
    const combined = [
        ...vendors1, 
        ...vendors2, 
        ...vendors3, 
        ...vendors4,
        ...vendors5,
        ...vendors6,
        ...vendors7,
        ...vendors8
    ];
    const uniqueVendors: any[] = [];
    const seenIds = new Set<string>();

    for (const vendor of combined) {
        if (vendor && vendor.id && !seenIds.has(vendor.id)) {
            seenIds.add(vendor.id);
            uniqueVendors.push(vendor);
        }
    }

    const allVendors = uniqueVendors.slice(0, 8);

    return {
        vendors: allVendors,
        isLoading:
            (isLoading1 && !!cat1Id) ||
            (isLoading2 && !!cat2Id) ||
            (isLoading3 && !!cat3Id) ||
            (isLoading4 && !!cat4Id) ||
            (isLoading5 && !!cat5Id) ||
            (isLoading6 && !!cat6Id) ||
            (isLoading7 && !!cat7Id) ||
            (isLoading8 && !!cat8Id),
    };
}
