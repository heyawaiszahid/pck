/** @type {import('next').NextConfig} */

const nextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard/settings",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/verify",
        destination: "/",
        permanent: true,
      },
      {
        source: "/dashboard/company",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pck-images.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
