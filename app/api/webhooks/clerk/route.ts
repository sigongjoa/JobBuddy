export const dynamic = "force-dynamic";

import { Webhook } from "svix";
import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import crypto from "crypto";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("svix-signature")!;

  let evt;
  try {
    evt = new Webhook(webhookSecret).verify(raw, sig) as any;
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const { id, type } = evt;

  console.log("Clerk Webhook Event:", type, "for user", id);

  // **user.created** 이벤트만 처리하고, 다른 타입은 바로 204로 종료**
  if (type !== "user.created") {
    return new NextResponse(null, { status: 204 });
  }

  // 실제로 privateMetadata에 키를 설정
  const decryptionKey = crypto.randomBytes(32).toString("hex");

  try {
    const client = clerkClient();  // 함수형 호출
    await client.users.updateUser(id, {
      privateMetadata: { decryptionKey },
    });
    console.log(`✅ Decryption key set for user ${id}`);
    return new NextResponse(null, { status: 200 });
  } catch (err: any) {
    // 404(Not Found)는 그냥 무시
    if (err.statusCode === 404) {
      console.warn(`⚠️ User not found (${id}), skipping.`);
      return new NextResponse(null, { status: 204 });
    }
    console.error("❌ Error updating user.privateMetadata:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 