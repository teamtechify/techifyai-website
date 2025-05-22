import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["dd.dexscreener.com", 'coin-images.coingecko.com'],
  },
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: './empty-module.ts',
        'pdfjs-dist/build/pdf.worker.min.mjs': './node_modules/pdfjs-dist/build/pdf.worker.min.mjs',
      },
    },
  },
  // async headers() {
  //   return [
  //     {
  //       // Apply to all paths
  //       source: '/:path*',
  //       headers: [
  //         {
  //           key: 'Cross-Origin-Embedder-Policy',
  //           value: 'unsafe-none',
  //         },
  //         {
  //           key: 'Cross-Origin-Opener-Policy',
  //           value: 'same-origin-allow-popups',
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;