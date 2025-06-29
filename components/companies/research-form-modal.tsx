"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface ResearchFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const skillOptions = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "AWS",
  "Docker",
  "Kubernetes",
  "GraphQL",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "Microservices",
]

export function ResearchFormModal({ open, onOpenChange }: ResearchFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    size: "",
    location: "",
    website: "",
    salaryRange: "",
    cultureNotes: "",
    products: "",
    newsUrls: "",
    requiredSkills: [] as string[],
    preparationMilestones: {
      companyResearch: false,
      productAnalysis: false,
      competitorAnalysis: false,
      interviewPrep: false,
    },
  })

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter((s) => s !== skill)
        : [...prev.requiredSkills, skill],
    }))
  }

  const handleMilestoneToggle = (milestone: keyof typeof formData.preparationMilestones) => {
    setFormData((prev) => ({
      ...prev,
      preparationMilestones: {
        ...prev.preparationMilestones,
        [milestone]: !prev.preparationMilestones[milestone],
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>회사 조사 추가</DialogTitle>
          <DialogDescription>연구 데이터베이스에 새 회사를 추가합니다.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">회사 이름</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="회사 이름"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">산업</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => setFormData({ ...formData, industry: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="산업 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="software">소프트웨어 개발</SelectItem>
                  <SelectItem value="fintech">핀테크</SelectItem>
                  <SelectItem value="healthcare">의료</SelectItem>
                  <SelectItem value="ecommerce">전자상거래</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">회사 규모</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="규모 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-50">1-50명 직원</SelectItem>
                  <SelectItem value="51-200">51-200명 직원</SelectItem>
                  <SelectItem value="201-1000">201-1000명 직원</SelectItem>
                  <SelectItem value="1000+">1000명 이상 직원</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">위치</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="도시, 주/국가"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">웹사이트</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryRange">연봉 범위</Label>
              <Input
                id="salaryRange"
                value={formData.salaryRange}
                onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                placeholder="10만 달러 - 15만 달러"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="products">제품/서비스</Label>
            <Textarea
              id="products"
              value={formData.products}
              onChange={(e) => setFormData({ ...formData, products: e.target.value })}
              placeholder="주요 제품, 서비스 또는 사업 분야"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cultureNotes">문화 참고 사항</Label>
            <Textarea
              id="cultureNotes"
              value={formData.cultureNotes}
              onChange={(e) => setFormData({ ...formData, cultureNotes: e.target.value })}
              placeholder="회사 문화, 가치, 근무 환경"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newsUrls">뉴스/RSS URL</Label>
            <Textarea
              id="newsUrls"
              value={formData.newsUrls}
              onChange={(e) => setFormData({ ...formData, newsUrls: e.target.value })}
              placeholder="Google 알림 또는 RSS 피드 URL (한 줄에 하나)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Required Skills</Label>
            <div className="grid grid-cols-3 gap-2">
              {skillOptions.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={formData.requiredSkills.includes(skill)}
                    onCheckedChange={() => handleSkillToggle(skill)}
                  />
                  <Label htmlFor={skill} className="text-sm">
                    {skill}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preparation Milestones</Label>
            <div className="space-y-2">
              {Object.entries(formData.preparationMilestones).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={() => handleMilestoneToggle(key as keyof typeof formData.preparationMilestones)}
                  />
                  <Label htmlFor={key} className="text-sm">
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Company</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
