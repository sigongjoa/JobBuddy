### `project-form-modal.tsx` `Cannot find name 'React'` 오류 (useEffect)

**설명:**
`components/portfolio/project-form-modal.tsx` 파일에서 `React.useEffect`를 사용했으나, `React` 네임스페이스가 명시적으로 임포트되지 않아 TypeScript 빌드 오류가 발생했습니다. 모듈 환경에서는 전역 UMD `React`를 바로 참조할 수 없으며, 필요한 훅을 명시적으로 임포트해야 합니다.

**오류 메시지:**
```
Cannot find name 'React'.
```

**해결책:**
`components/portfolio/project-form-modal.tsx` 파일 상단에서 `import { useState } from "react"` 부분을 `import { useState, useEffect } from "react"`로 변경하여 `useEffect` 훅을 명시적으로 임포트했습니다. 또한, 컴포넌트 본문에서 `React.useEffect(...)`로 되어 있던 부분을 `useEffect(...)`로 변경하여 문제를 해결했습니다.

```typescript
// components/portfolio/project-form-modal.tsx

// ... existing code ...
import { useState, useEffect } from "react" // 수정된 임포트
// ... existing code ...

  useEffect(() => { // React.useEffect에서 useEffect로 변경
    // ...
  }, [initialData]);
// ... existing code ...
``` 