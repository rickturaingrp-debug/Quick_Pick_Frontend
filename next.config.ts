import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    trailingSlash: true,
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "http",
                hostname: "bazaar.resheragroup.in",
            },
            {
                protocol: "https",
                hostname: "bazaar.resheragroup.in",
            },
        ],
    },
};

export default nextConfig;