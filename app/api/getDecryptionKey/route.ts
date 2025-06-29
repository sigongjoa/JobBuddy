import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const headersList = await headers();
  console.debug("GET /api/getDecryptionKey - 요청 시작");

  const { userId } = await auth();
  if (!userId) {
    console.warn("GET /api/getDecryptionKey - 사용자 인증 실패");
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const client = clerkClient();
    const user = await client.users.getUser(userId);
    const key = user.privateMetadata.decryptionKey as string | undefined;

    if (!key) {
      console.warn(`GET /api/getDecryptionKey - 사용자 ${userId}의 복호화 키가 설정되지 않았습니다.`);
      return new NextResponse("Decryption key not set.", { status: 404 });
    }

    console.debug(`GET /api/getDecryptionKey - 사용자 ${userId}의 복호화 키 성공적으로 반환.`);
    return NextResponse.json({ key });
  } catch (error) {
    console.error("GET /api/getDecryptionKey - 키 가져오기 중 오류 발생:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 