/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
let supabaseOrigin = ''
try {
  if (supabaseUrl) {
    supabaseOrigin = new URL(supabaseUrl).origin
  }
} catch {}

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://chatling.ai https://*.chatling.ai;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: blob: https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://chatling.ai https://*.chatling.ai;
              media-src 'self';
              font-src 'self' https://res.cloudinary.com;
              connect-src 'self' ${supabaseOrigin} https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://chatling.ai https://*.chatling.ai;
              frame-src 'self' ${supabaseOrigin} https://chatling.ai https://*.chatling.ai;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'self';
              upgrade-insecure-requests;
            `.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
}

export default nextConfig
