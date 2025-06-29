### `Interview` 타입 불일치 및 중복 정의

**설명:**
애플리케이션의 여러 부분(`app/interviews/page.tsx`, `components/interviews/schedule-form-modal.tsx`, `components/interviews/schedule-table.tsx`)에서 `Interview` 타입이 중복으로 정의되어 타입 불일치 오류를 야기했습니다. 특히 `Interview` 인터페이스의 `id` 타입이 `string`과 `number`로 혼용되어 문제가 발생했습니다.

**해결책:**
1.  `Interview` 인터페이스를 `lib/types.ts`에서 단일 소스로 정의하고, 다른 파일에서는 `@/lib/types`에서 임포트하도록 수정되었습니다.
2.  `lib/types.ts`의 `Interview` 인터페이스에서 `id` 타입을 `string`에서 `number`로 변경하여 `addInterview` 함수의 ID 생성 로직과 일치시켰습니다.
3.  `components/interviews/schedule-form-modal.tsx`에서 `onAddInterview` 콜백 시그니처를 `Omit<Interview, "id">`로 확장하여 ID를 제외한 데이터만 전달하도록 했습니다.
4.  `components/interviews/schedule-table.tsx`에서 `Interview` 타입의 `nextAction`과 `feedback` 필드가 선택적 필드가 되었으므로, 렌더링 시 `undefined`를 처리하도록 `?? "—"`를 추가했습니다. 