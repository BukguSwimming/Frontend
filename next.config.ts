import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Next.js Docker 배포를 위해 반드시 필요: 빌드 시 최소 파일만 포함하는 standalone 폴더 생성
  output: 'standalone', 

  // 2025 06 17 강병오 SSL 적용위해 추가
  // basePath: '/bukguswim',
  // assetPrefix: '/bukguswim',
  
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`, // Flask API 프록시
  //     },
  //   ]
  // },
}

export default nextConfig