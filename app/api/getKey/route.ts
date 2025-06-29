import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  console.debug("getKey API: GET request received");
  const { userId } = auth();

  if (!userId) {
    console.warn("getKey API: Unauthorized access attempt - No userId");
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // 실제 키는 서버 환경 변수나 비밀 저장소에서 가져오는 것이 안전합니다.
  // 예시: process.env.DECRYPTION_KEY_FOR_clerk_user_id
  const decryptionKey = process.env[`DECRYPTION_KEY_FOR_${userId}`];

  if (!decryptionKey) {
    console.error(`getKey API: Decryption key not found for userId: ${userId}`);
    return new NextResponse(JSON.stringify({ error: "Key not found" }), { status: 404 });
  }

  console.debug(`getKey API: Successfully retrieved key for userId: ${userId}`);
  return NextResponse.json({ key: decryptionKey });
} 