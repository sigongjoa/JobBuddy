### `project-card.tsx`에서 `FeedbackList` 컴포넌트 prop 누락 오류

**설명:**
`components/portfolio/feedback-list.tsx`의 `FeedbackList` 컴포넌트가 `feedback` prop을 필수로 받도록 변경되었음에도 불구하고, `components/portfolio/project-card.tsx`에서 `FeedbackList`를 호출할 때 `feedback` prop을 전달하지 않아 빌드 오류가 발생했습니다.

**오류 메시지:**
```
Property 'feedback' is missing in type '{}' but required in type 'FeedbackListProps'.
```

**해결책:**
`components/portfolio/project-card.tsx` 파일에서 `FeedbackList` 컴포넌트를 호출하는 부분에 `feedback={feedbackArray}` prop을 추가하여 문제를 해결했습니다.

```typescript
// components/portfolio/project-card.tsx

// ... existing code ...

          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <p className="text-sm font-medium">피드백 ({feedbackArray.length})</p>
          </div>
          <FeedbackList feedback={feedbackArray} /> // 수정된 부분
        </div>

// ... existing code ...
``` 