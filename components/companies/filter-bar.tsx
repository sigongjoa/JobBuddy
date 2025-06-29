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
        <Input placeholder="회사 검색..." className="pl-8" />
      </div>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="산업" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 산업</SelectItem>
          <SelectItem value="software">소프트웨어 개발</SelectItem>
          <SelectItem value="fintech">핀테크</SelectItem>
          <SelectItem value="healthcare">의료</SelectItem>
          <SelectItem value="ecommerce">전자상거래</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="회사 규모" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 규모</SelectItem>
          <SelectItem value="startup">1-50</SelectItem>
          <SelectItem value="small">51-200</SelectItem>
          <SelectItem value="medium">201-1000</SelectItem>
          <SelectItem value="large">1000+</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="준비 상태" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 상태</SelectItem>
          <SelectItem value="not-started">시작 안 함</SelectItem>
          <SelectItem value="in-progress">진행 중</SelectItem>
          <SelectItem value="completed">완료됨</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon">
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  )
}
