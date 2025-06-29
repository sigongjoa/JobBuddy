/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  api: {
    externalResolver: true,
  },
};

export default nextConfig;
