# # ----------------------------------------------------------------
# # Stage 1: 의존성 설치 및 프로젝트 빌드 (Build Stage)
# # ----------------------------------------------------------------
# FROM node:20-alpine AS builder 

# # 1. 환경 설정
# WORKDIR /app
# ENV PATH /app/node_modules/.bin:$PATH

# # 2. 의존성 파일 복사 및 설치
# COPY package.json package-lock.json ./
# RUN npm ci --prefer-offline --no-audit

# # 3. Next.js 설정 파일 복사 (Standalone 빌드 활성화를 위해 필수)
# # 사용자의 프로젝트는 'next.config.ts'를 사용하므로 파일명을 수정합니다.
# COPY next.config.ts ./ 

# # 4. 소스 코드 및 나머지 파일 복사
# COPY . .

# # Next.js의 기본 빌드 명령 실행. 이 명령이 성공해야 /app/.next/standalone이 생성됩니다.
# RUN npm run build


# # ----------------------------------------------------------------
# # Stage 2: 최종 경량 이미지 구성 (Runner Stage)
# # ----------------------------------------------------------------
# FROM node:20-alpine AS runner 

# # Node.js 서버가 실행될 사용자 생성 (보안 강화)
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# # 1. 환경 설정
# WORKDIR /app

# # 2. 최종 실행에 필요한 파일 복사 (Builder Stage에서 가져옴)
# # 주의: /app/.next/standalone이 실제로 생성되었는지 반드시 확인해야 합니다.
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# # public 폴더 복사
# COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# # .next/static 폴더 복사
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# # 소유권은 이미 COPY 단계에서 지정했지만, 혹시 모를 캐시나 기타 파일 접근 문제를 위해 한 번 더 전체 소유권을 변경합니다.
# RUN chown -R nextjs:nodejs /app

# # 3. 최종 사용자 지정 (보안)
# USER nextjs

# # 4. 앱이 실행될 포트 노출
# EXPOSE 3000

# # 5. 서버 실행 (Next.js Standalone 모드 실행)
# CMD ["node", "server.js"]

# 1. Base 이미지 설정
FROM node:20-alpine

# 2. 작업 디렉토리 생성
WORKDIR /app

# 3. 의존성 설치 (캐시 활용을 위해 소스보다 먼저 복사)
COPY package.json package-lock.json ./
RUN npm install

# 4. 소스 코드 복사 (전체 복사하지만, 실제 개발시에는 Volume으로 덮어씌움)
COPY . .

# 5. 개발 서버 포트 노출
EXPOSE 5000

# 6. 환경 변수 설정 (개발 모드)
ENV NODE_ENV=development
# 컨테이너 내에서 소스 변경을 감지하기 위해 필요한 경우가 있음 (특히 Windows/WSL)
ENV WATCHPACK_POLLING=true

# 7. 실행 명령 (Next.js 개발 서버 실행)
CMD ["npm", "run", "dev"]

# FROM node:20-alpine 

# WORKDIR /Frontend

# # 개발 환경에서는 모든 의존성을 설치해야 합니다.
# COPY package.json package-lock.json ./
# RUN npm install 

# # 소스 코드 전체를 복사합니다.
# COPY . .

# EXPOSE 3000

# # 개발 서버 실행 명령어를 사용합니다.
# CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]