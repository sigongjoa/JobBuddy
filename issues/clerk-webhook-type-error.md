## 버그: Clerk 웹훅 Webhook.verify() 타입 오류로 인한 빌드 실패

### 발생 이유
Vercel 배포 시 `app/api/webhooks/clerk/route.ts` 파일의 `Webhook.verify()` 호출에서 타입 오류가 발생하여 빌드가 실패했습니다. 이는 `Webhook.verify()` 메서드의 두 번째 인자로 문자열 대신 헤더 객체를 전달해야 하는데, 이를 지키지 않아 발생했습니다.

**오류 메시지:**
```
Type error: Argument of type 'string' is not assignable to parameter of type 'WebhookRequiredHeaders | WebhookUnbrandedRequiredHeaders | Record<string, string>'.
```

### 재현 절차
1. `app/api/webhooks/clerk/route.ts` 파일에서 `Webhook.verify()`의 두 번째 인자를 문자열로 전달합니다.
2. `pnpm run build`를 로컬에서 실행하거나 Vercel에 배포를 시도합니다.
3. 빌드 과정에서 위 타입 오류로 인해 컴파일이 실패합니다.

### 기대 동작
`Webhook.verify()` 메서드가 올바른 인자 타입으로 호출되어 빌드가 성공하고 웹훅 기능이 정상적으로 작동합니다.

### 해결된 코드
`app/api/webhooks/clerk/route.ts` 파일에서 `req.headers.get()`으로 가져오는 시그니처 헤더 이름을 `clerk-signature`로 변경하고, `Webhook.verify()` 메서드의 두 번째 인자로 시그니처 문자열 대신 헤더 객체를 전달하도록 수정했습니다.

```typescript
// app/api/webhooks/clerk/route.ts

// ... existing code ...

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("clerk-signature")!; // 변경: svix-signature 대신 clerk-signature

  let evt;
  try {
    evt = new Webhook(webhookSecret).verify(
      raw,
      { 'clerk-signature': sig } // 변경: 문자열 대신 헤더 객체로 전달
    ) as any;
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  // ... existing code ...
}
```

### 환경
- Next.js 15.2.4
- Clerk SDK
- Vercel 배포 환경 