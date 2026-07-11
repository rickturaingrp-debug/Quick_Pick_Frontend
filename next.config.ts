import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",

    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "bazaar.resheragroup.in",
            },
        ],
    },
};

export default nextConfig;
