import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Nonaktifkan reactRefresh untuk memastikan HMR berfungsi dengan benar
  // reactRefresh: true,
  // Ensure HMR works properly
  // hotReloader: {
  //   overlay: {
  //     warnings: false,
  //     errors: true,
  //   },
  // },
};

export default nextConfig;
