/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hqoouyasmfhlzmmyvbnr.supabase.co',
        pathname: '/storage/v1/object/public/post_thumbnail/**',
      },
    ],
  },
}

export default nextConfig;
