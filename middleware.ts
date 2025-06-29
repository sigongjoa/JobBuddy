import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/interviews", "/api/getDecryptionKey"],
  // 여기에 Clerk의 publicRoutes나 ignoredRoutes 등을 추가할 수 있습니다.
  // 예시: publicRoutes: ["/", "/sign-in", "/sign-up"],
});

export const config = {
  matcher: [
    "/api/getDecryptionKey",   // 키 제공 API
    "/companies/:path*",       // 회사 관련 페이지 보호
    "/interviews/:path*",      // 면접 관련 페이지 보호
    "/portfolio/:path*",       // 포트폴리오 관련 페이지 보호
    "/settings/:path*",        // 설정 페이지 보호
    // 필요한 경우 여기에 다른 보호할 경로를 추가하세요.
  ]
}; 