import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
};

export default nextConfig;

module.exports = {
    images: {
        remotePatterns: [
            new URL('https://svhsddzfhdfuehbaasbl.supabase.co/storage/v1/**'),
            new URL('https://images.pexels.com/photos/**'),
        ],
    },
}
