"use client"

import { ChevronDown, ExternalLink, Calendar } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

interface NewsFeedAccordionProps {
  companyName: string
}

const mockNews = [
  {
    id: 1,
    title: "회사 4분기 실적 호조 발표",
    summary: "전년 대비 매출 25% 증가, 클라우드 서비스 부문에서 강력한 성장.",
    date: "2024-01-20",
    url: "https://example.com/news1",
  },
  {
    id: 2,
    title: "신제품 출시: AI 기반 분석 플랫폼",
    summary: "기업 고객을 위한 혁신적인 머신러닝 플랫폼.",
    date: "2024-01-18",
    url: "https://example.com/news2",
  },
  {
    id: 3,
    title: "엔지니어링 팀 확장",
    summary: "프론트엔드, 백엔드, DevOps 역할에 걸쳐 200명 이상의 엔지니어 채용.",
    date: "2024-01-15",
    url: "https://example.com/news3",
  },
]

export function NewsFeedAccordion({ companyName }: NewsFeedAccordionProps) {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between bg-transparent">
          최신 뉴스
          <ChevronDown className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 mt-2">
        {mockNews.map((item) => (
          <div key={item.id} className="p-3 border rounded-lg space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-medium leading-tight">{item.title}</h4>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">{item.summary}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {item.date}
            </div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
