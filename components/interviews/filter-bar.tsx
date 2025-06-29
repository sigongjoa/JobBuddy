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
        <Input placeholder="회사 또는 역할 검색..." className="pl-8" />
      </div>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 상태</SelectItem>
          <SelectItem value="scheduled">예정됨</SelectItem>
          <SelectItem value="completed">완료됨</SelectItem>
          <SelectItem value="cancelled">취소됨</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="면접 유형" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 유형</SelectItem>
          <SelectItem value="technical">기술</SelectItem>
          <SelectItem value="behavioral">행동</SelectItem>
          <SelectItem value="system-design">시스템 설계</SelectItem>
          <SelectItem value="final">최종 라운드</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon">
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  )
}
