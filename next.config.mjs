/** @type {import('next').NextConfig} */
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
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: blob:;
              media-src 'self';
              font-src 'self';
              connect-src 'self' https://fwtgultjefshvdfnpipw.supabase.co;
              frame-src 'self' https://fwtgultjefshvdfnpipw.supabase.co https://my.spline.design;
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
