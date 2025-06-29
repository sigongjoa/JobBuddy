"use client"

import type React from "react"
import { Interview } from "@/lib/types"

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

interface ScheduleFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddInterview: (newInterview: Omit<Interview, "id">) => void
}

export function ScheduleFormModal({ open, onOpenChange, onAddInterview }: ScheduleFormModalProps) {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    applicationDate: "",
    interviewDate: "",
    interviewTime: "",
    type: "",
    status: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddInterview({
      ...formData,
      nextAction: "",
      feedback: "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>면접 추가</DialogTitle>
          <DialogDescription>일정에 새 면접을 추가하세요. 아래 세부 정보를 입력하세요.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">회사</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="회사 이름"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">역할</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="직무명"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicationDate">지원 날짜</Label>
              <Input
                id="applicationDate"
                type="date"
                value={formData.applicationDate}
                onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interviewDate">면접 날짜</Label>
              <Input
                id="interviewDate"
                type="date"
                value={formData.interviewDate}
                onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">면접 유형</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">기술</SelectItem>
                  <SelectItem value="behavioral">행동</SelectItem>
                  <SelectItem value="system-design">시스템 설계</SelectItem>
                  <SelectItem value="final">최종 라운드</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">상태</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">예정됨</SelectItem>
                  <SelectItem value="completed">완료됨</SelectItem>
                  <SelectItem value="cancelled">취소됨</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">메모</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="면접 피드백, 준비 메모 등"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit">면접 저장</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
