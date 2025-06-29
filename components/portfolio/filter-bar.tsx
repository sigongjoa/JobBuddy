"use client"

import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function FilterBar() {
  return (
    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="프로젝트 검색..." className="pl-8" />
      </div>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 상태</SelectItem>
          <SelectItem value="completed">완료됨</SelectItem>
          <SelectItem value="in-progress">진행 중</SelectItem>
          <SelectItem value="needs-update">업데이트 필요</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="기술 스택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 기술</SelectItem>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="typescript">TypeScript</SelectItem>
          <SelectItem value="nodejs">Node.js</SelectItem>
          <SelectItem value="python">Python</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="대상 스킬" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 스킬</SelectItem>
          <SelectItem value="fullstack">풀스택 개발</SelectItem>
          <SelectItem value="frontend">프론트엔드 개발</SelectItem>
          <SelectItem value="backend">백엔드 개발</SelectItem>
          <SelectItem value="mobile">모바일 개발</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon">
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  )
}
