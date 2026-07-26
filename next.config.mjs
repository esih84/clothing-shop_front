/** @type {import('next').NextConfig} */
const nextConfig = {
  // standalone output for a lightweight Docker image (self-contained server.js, reads PORT/HOSTNAME)
  output: "standalone",
  // Allow dev-server access from the network/WSL IP (fixes the cross-origin warning)
  allowedDevOrigins: ["localhost"],
  experimental: {
    viewTransition: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
