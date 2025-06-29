### `project-form-modal.tsx` `Parameter 'line' implicitly has an 'any' type` 오류 (filter/map)

**설명:**
`components/portfolio/project-form-modal.tsx` 파일의 `handleSubmit` 함수 내부에서 `formData.plannedImprovements`를 처리하는 과정 중 `split`, `filter`, `map` 메서드에 사용된 콜백 함수의 매개변수 `line`의 타입을 TypeScript가 암시적으로 `any`로 추론하여 빌드 오류가 발생했습니다. 이는 `tsconfig.json`의 `noImplicitAny` 설정 때문입니다.

**오류 메시지:**
```
Parameter 'line' implicitly has an 'any' type.
```

**해결책:**
`components/portfolio/project-form-modal.tsx` 파일에서 `handleSubmit` 함수 내의 `filter` 및 `map` 콜백 매개변수 `line`의 타입을 `(line: string)` 및 `(line: string, index: number)`로 명시적으로 지정하여 문제를 해결했습니다.

```typescript
// components/portfolio/project-form-modal.tsx

// ... existing code ...
  const handleSubmit = (e: React.FormEvent) => {
    // ...
    const improvementsArray = formData.plannedImprovements
      .split('\n')
      .filter((line: string) => line.trim() !== '') // 수정된 부분
      .map((line: string, index: number) => ({ id: Date.now() + index, task: line.trim(), completed: false })); // 수정된 부분
    // ...
  };
// ... existing code ...
``` 