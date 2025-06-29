"use client"

import { MoreHorizontal, Github, ExternalLink, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "완료됨";
    case "in-progress":
      return "진행 중";
    case "needs-update":
      return "업데이트 필요";
    default:
      return "알 수 없음";
  }
};

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

interface ProjectTableProps {
  projects: any[];
  onEditProject: (project: any) => void;
  onDeleteProject: (id: number) => void;
}

export function ProjectTable({ projects, onEditProject, onDeleteProject }: ProjectTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>프로젝트</TableHead>
            <TableHead>기술 스택</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>링크</TableHead>
            <TableHead>피드백</TableHead>
            <TableHead>진행률</TableHead>
            <TableHead>마지막 업데이트</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                아직 프로젝트가 없습니다. 새로운 프로젝트를 추가해보세요.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {project.techStack && typeof project.techStack === 'string' ? (
                      project.techStack.split(',').map((tech: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tech.trim()}
                        </Badge>
                      ))
                    ) : (
                      project.techStack?.slice(0, 2).map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))
                    )}
                    {project.techStack && Array.isArray(project.techStack) && project.techStack.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.techStack.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusText(project.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">{project.feedbackCount || 0}</span>
                    {project.avgRating > 0 && (
                      <>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{project.avgRating}</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={project.progressPercentage || 0} className="w-16 h-2" />
                    <span className="text-sm text-muted-foreground">{project.progressPercentage || 0}%</span>
                  </div>
                </TableCell>
                <TableCell>{project.lastUpdated || 'N/A'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditProject(project)}>수정</DropdownMenuItem>
                      {/* <DropdownMenuItem>복제</DropdownMenuItem> */}
                      <DropdownMenuItem onClick={() => onDeleteProject(project.id)} className="text-red-600">삭제</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
