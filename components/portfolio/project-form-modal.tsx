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
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import React from "react"

interface ProjectFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: any | null;
  onSubmit: (project: any) => void;
}

const skillOptions = [
  "풀스택 개발",
  "프론트엔드 개발",
  "백엔드 개발",
  "모바일 개발",
  "API 개발",
  "데이터베이스 설계",
  "UI/UX 디자인",
  "DevOps",
  "테스팅",
  "성능 최적화",
  "보안",
  "데이터 시각화",
  "실시간 애플리케이션",
  "마이크로서비스",
  "클라우드 컴퓨팅",
]

export function ProjectFormModal({ open, onOpenChange, initialData, onSubmit }: ProjectFormModalProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    githubUrl: initialData?.githubUrl || "",
    liveUrl: initialData?.liveUrl || "",
    techStack: (initialData?.techStack && typeof initialData.techStack === 'string') ? initialData.techStack.split(',').map((s: string) => s.trim()) : (initialData?.techStack || []) as string[],
    targetSkills: initialData?.targetSkills || [] as string[],
    status: initialData?.status || "",
    plannedImprovements: initialData?.improvements?.map((imp: any) => imp.task).join('\n') || "",
    feedbackCount: initialData?.feedbackCount || 0,
    avgRating: initialData?.avgRating || 0,
    progressPercentage: initialData?.progressPercentage || 0,
    lastUpdated: initialData?.lastUpdated || new Date().toISOString().split('T')[0],
  })

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        githubUrl: initialData.githubUrl || "",
        liveUrl: initialData.liveUrl || "",
        techStack: (initialData.techStack && typeof initialData.techStack === 'string') ? initialData.techStack.split(',').map((s: string) => s.trim()) : (initialData.techStack || []) as string[],
        targetSkills: initialData.targetSkills || [] as string[],
        status: initialData.status || "",
        plannedImprovements: initialData.improvements?.map((imp: any) => imp.task).join('\n') || "",
        feedbackCount: initialData.feedbackCount || 0,
        avgRating: initialData.avgRating || 0,
        progressPercentage: initialData.progressPercentage || 0,
        lastUpdated: initialData.lastUpdated || new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({
        title: "",
        description: "",
        githubUrl: "",
        liveUrl: "",
        techStack: [] as string[],
        targetSkills: [] as string[],
        status: "",
        plannedImprovements: "",
        feedbackCount: 0,
        avgRating: 0,
        progressPercentage: 0,
        lastUpdated: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      targetSkills: prev.targetSkills.includes(skill)
        ? prev.targetSkills.filter((s) => s !== skill)
        : [...prev.targetSkills, skill],
    }))
  }

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      targetSkills: prev.targetSkills.filter((s) => s !== skill),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    const improvementsArray = formData.plannedImprovements
      .split('\n')
      .filter(line => line.trim() !== '')
      .map((line, index) => ({ id: Date.now() + index, task: line.trim(), completed: false }));

    const techStackArray = typeof formData.techStack === 'string' 
      ? formData.techStack.split(',').map(s => s.trim()).filter(s => s !== '') 
      : formData.techStack; 

    const submittedData = {
      ...formData,
      techStack: techStackArray,
      improvements: improvementsArray,
      plannedImprovements: undefined,
    };

    onSubmit(submittedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>프로젝트 추가</DialogTitle>
          <DialogDescription>포트폴리오에 새 프로젝트를 추가하고 진행 상황을 추적하세요.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">프로젝트 제목</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="나의 멋진 프로젝트"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="프로젝트에 대한 간략한 설명"
                rows={2}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/사용자이름/저장소"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="liveUrl">라이브 데모 URL</Label>
              <Input
                id="liveUrl"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://내프로젝트.vercel.app"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">프로젝트 상태</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">완료됨</SelectItem>
                <SelectItem value="in-progress">진행 중</SelectItem>
                <SelectItem value="needs-update">업데이트 필요</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="techStack">기술 스택</Label>
            <Input
              id="techStack"
              value={formData.techStack.join(',')}
              onChange={(e) => setFormData({ ...formData, techStack: e.target.value.split(',').map((s: string) => s.trim()) })}
              placeholder="예: React, Node.js, TypeScript (쉼표로 구분)"
            />
          </div>

          <div className="space-y-2">
            <Label>대상 스킬</Label>
            {formData.targetSkills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {formData.targetSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0"
                      onClick={() => removeSkill(skill)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded p-2">
              {skillOptions.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={formData.targetSkills.includes(skill)}
                    onCheckedChange={() => handleSkillToggle(skill)}
                  />
                  <Label htmlFor={skill} className="text-sm font-normal">
                    {skill}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plannedImprovements">계획된 개선 사항</Label>
            <Textarea
              id="plannedImprovements"
              value={formData.plannedImprovements}
              onChange={(e) => setFormData({ ...formData, plannedImprovements: e.target.value })}
              placeholder="향후 개선 사항, 버그 수정 등"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit">프로젝트 저장</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
