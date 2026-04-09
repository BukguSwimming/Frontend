import type { NextConfig } from 'next'

const nextConfig: NextConfig = {

  // 2026 04 07 개발 모드용 설정
  // -----------------------------------------------------------------------------------------
  // 1. 최상위 레벨에 위치해야 합니다 (Next.js 15+ 기준)
  allowedDevOrigins: [
    'api-bgswim.bnecloud.co.kr',
    'bgswim.bnecloud.co.kr'
  ],

  // 2. 환경에 따른 output 설정
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  // -----------------------------------------------------------------------------------------

  
  // 2026 04 기존 배포용 설정
  // -----------------------------------------------------------------------------------------
  // Next.js Docker 배포를 위해 반드시 필요: 빌드 시 최소 파일만 포함하는 standalone 폴더 생성
  // output: 'standalone', 
  // -----------------------------------------------------------------------------------------
  
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL

    return [
      // {
      //   source: '/api/bukguswim/:path*',
      //   destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/:path*`, // Flask API 프록시
      // },
      {
      source: '/api/bukguswim/v1/:path*',
      destination: `${backend}/api/v1/:path*`,
      },
      {
        source: '/api/bukguswim/v2/:path*',
        destination: `${backend}/api/v2/:path*`,
      },
    ]
  },
}

export default nextConfig