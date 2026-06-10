/** @type {import('next').NextConfig} */
const basePath = "";
const nextConfig = {
  output: "standalone",
  basePath,
  serverActions: {
    bodySizeLimit: "12mb",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "odart.pl", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "www.odart.pl", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "dev.rafalkowalkowski.pl", pathname: "/demo/**" },
      { protocol: "https", hostname: "rafalkowalkowski.pl", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "www.rafalkowalkowski.pl", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  async redirects() {
    return [
      // Jedna kanoniczna wersja URL bez końcowego „/” (unik duplikatów w GSC).
      {
        source: "/produkt/:slug/",
        destination: "/produkt/:slug",
        permanent: true,
        has: [{ type: "host", value: "odart.pl" }],
      },
      {
        source: "/produkt/:slug/",
        destination: "/produkt/:slug",
        permanent: true,
        has: [{ type: "host", value: "www.odart.pl" }],
      },
      {
        source: "/portal/zabieg/:slug/",
        destination: "/portal/zabieg/:slug",
        permanent: true,
      },
      {
        source: "/portal/gabinety/:path*/",
        destination: "/portal/gabinety/:path*",
        permanent: true,
      },
      {
        source: "/portal/gabinet/:slug/",
        destination: "/portal/gabinet/:slug",
        permanent: true,
      },
      {
        source: "/portal/artykuly/:slug/",
        destination: "/portal/artykuly/:slug",
        permanent: true,
      },
      {
        source: "/portfolio/:slug/",
        destination: "/portfolio/:slug",
        permanent: true,
      },
      {
        source: "/zabiegi/",
        destination: "/zabiegi",
        permanent: true,
      },
      {
        source: "/portal/",
        destination: "/portal",
        permanent: true,
      },
      {
        source: "/portfolio/",
        destination: "/portfolio",
        permanent: true,
      },
      {
        source: "/restauracja-zlota",
        destination: "https://zamow.odart.pl/restauracja-zlota",
        permanent: true,
      },
      {
        source: "/restauracja-zlota/:path*",
        destination: "https://zamow.odart.pl/restauracja-zlota",
        permanent: true,
      },
      // SEO: przyjazne URL pod „gabinet kosmetyczny {miasto}” → kanoniczna lista miast.
      {
        source: "/gabinet-kosmetyczny-:city",
        destination: "/portal/gabinety/:city",
        permanent: true,
      },
      {
        source: "/gabinet-koszalin",
        destination: "/portal/gabinety/koszalin",
        permanent: true,
      },
      {
        source: "/gabinet-kolobrzeg",
        destination: "/portal/gabinety/kolobrzeg",
        permanent: true,
      },
      {
        source: "/gabinet-warszawa",
        destination: "/portal/gabinety/warszawa",
        permanent: true,
      },
      // Synonimy fraz B2B → jeden landing.
      {
        source: "/strona-dla-gabinetu",
        destination: "/strona-internetowa-dla-gabinetu-kosmetycznego",
        permanent: true,
      },
      {
        source: "/strona-internetowa-dla-gabinetu",
        destination: "/strona-internetowa-dla-gabinetu-kosmetycznego",
        permanent: true,
      },
      {
        source: "/strona-dla-kosmetyczki",
        destination: "/strona-internetowa-dla-kosmetyczek",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
        ],
      },
      {
        source: "/opieka-it-dla-firm-kolobrzeg",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
      {
        source: "/opieka-it-dla-firm-kolobrzeg/",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
      {
        source: "/opieka-it-dla-firm-kolobrzeg/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
    ];
  },
};

module.exports = nextConfig;
