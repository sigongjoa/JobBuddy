"use client"

import { Building2, MapPin, Users, ExternalLink, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SkillMatchIndicator } from "./skill-match-indicator"
import { NewsFeedAccordion } from "./news-feed-accordion"

interface Company {
  id: number
  name: string
  industry: string
  size: string
  culture: string[]
  salaryRange: string
  preparationStatus: number
  skillMatch: number
  location: string
  website: string
  lastUpdated: string
  notes: string
}

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {company.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{company.industry}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>수정</DropdownMenuItem>
              <DropdownMenuItem>세부 정보 보기</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">삭제</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {company.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {company.size}명 직원
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ExternalLink className="h-4 w-4" />
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              회사 웹사이트
            </a>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">문화 키워드</p>
          <div className="flex flex-wrap gap-1">
            {company.culture.map((keyword) => (
              <Badge key={keyword} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">연봉 범위</p>
          <p className="text-sm text-muted-foreground">{company.salaryRange}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">준비 진행률</p>
            <span className="text-sm text-muted-foreground">{company.preparationStatus}%</span>
          </div>
          <Progress value={company.preparationStatus} className="h-2" />
        </div>

        <SkillMatchIndicator percentage={company.skillMatch} />

        <NewsFeedAccordion companyName={company.name} />

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">마지막 업데이트: {company.lastUpdated}</p>
        </div>
      </CardContent>
    </Card>
  )
}
