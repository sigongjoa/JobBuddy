"use client"

import { Github, ExternalLink, MoreHorizontal, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FeedbackList } from "./feedback-list"
import { UpdateTracker } from "./update-tracker"

interface Feedback {
  id: number
  source: string
  comment: string
  date: string
  rating: number
}

interface Improvement {
  id: number
  task: string
  completed: boolean
}

interface Project {
  id: number
  title: string
  description: string
  githubUrl: string
  liveUrl: string
  techStack: string | string[]
  targetSkills: string | string[]
  lastUpdated: string
  status: "completed" | "in-progress" | "needs-update"
  feedback?: Feedback[]
  improvements?: Improvement[]
}

interface ProjectCardProps {
  project: Project
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "in-progress":
      return <Clock className="h-4 w-4 text-blue-600" />
    case "needs-update":
      return <AlertCircle className="h-4 w-4 text-orange-600" />
    default:
      return null
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "in-progress":
      return "bg-blue-100 text-blue-800"
    case "needs-update":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  // Ensure project.improvements is an array, default to empty array if not present
  const improvementsArray: Improvement[] = Array.isArray(project.improvements)
    ? project.improvements
    : [];
  const completedImprovements = improvementsArray.filter((imp: any) => imp.completed).length;
  const totalImprovements = improvementsArray.length;
  const progressPercentage = totalImprovements > 0 ? (completedImprovements / totalImprovements) * 100 : 0;

  // Convert techStack to array
  const techStackArray: string[] = Array.isArray(project.techStack)
    ? project.techStack
    : typeof project.techStack === 'string'
      ? project.techStack.split(',').map(s => s.trim())
      : [];

  // Convert targetSkills to array
  const targetSkillsArray: string[] = Array.isArray(project.targetSkills)
    ? project.targetSkills
    : typeof project.targetSkills === 'string'
      ? project.targetSkills.split(',').map(s => s.trim())
      : [];

  // Ensure project.feedback is an array, default to empty array if not present
  const feedbackArray: Feedback[] = Array.isArray(project.feedback)
    ? project.feedback
    : [];

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{project.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>프로젝트 수정</DropdownMenuItem>
              <DropdownMenuItem>프로젝트 복제</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">프로젝트 삭제</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {getStatusIcon(project.status)}
          <Badge className={getStatusColor(project.status)}>
            {project.status === "completed" ? "완료됨" : project.status === "in-progress" ? "진행 중" : project.status === "needs-update" ? "업데이트 필요" : project.status}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            라이브 데모
          </a>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">개선 진행률</p>
            <span className="text-sm text-muted-foreground">
              {completedImprovements}/{totalImprovements}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <UpdateTracker improvements={improvementsArray} />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <p className="text-sm font-medium">피드백 ({feedbackArray.length})</p>
          </div>
          <FeedbackList feedback={feedbackArray} />
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">마지막 업데이트: {project.lastUpdated}</p>
        </div>

        {techStackArray.length > 0 && (
          <div>
            <p className="text-sm font-medium">기술 스택</p>
            <div className="flex flex-wrap gap-1">
              {techStackArray.map((tech, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {targetSkillsArray.length > 0 && (
          <div>
            <p className="text-sm font-medium">대상 스킬</p>
            <div className="flex flex-wrap gap-1">
              {targetSkillsArray.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
