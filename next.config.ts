import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ["192.168.0.230"],
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