import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Bu ayar, ESLint uyarılarının yapıyı durdurmasını engeller
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript hatalarının yapıyı durdurmasını engeller (üretimde kullanırken dikkatli olun)
    ignoreBuildErrors: true,
  },
  // Gerekirse diğer Next.js konfigürasyon seçeneklerini buraya ekleyebilirsiniz
  // Örneğin:
  // webpack: (config, { isServer }) => {
  //   // Özel webpack konfigürasyonları
  //   return config;
  // },
};

export default nextConfig;