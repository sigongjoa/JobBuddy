"use client"

import { MoreHorizontal, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Interview {
  id: number;
  company: string;
  role: string;
  applicationDate: string;
  interviewDate: string;
  type: string;
  status: string;
  nextAction: string;
  feedback: string;
}

interface ScheduleTableProps {
  interviews: Interview[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "예정됨":
      return "bg-blue-100 text-blue-800"
    case "완료됨":
      return "bg-green-100 text-green-800"
    case "취소됨":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function ScheduleTable({ interviews }: ScheduleTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>회사</TableHead>
            <TableHead>역할</TableHead>
            <TableHead>지원 날짜</TableHead>
            <TableHead>면접 날짜</TableHead>
            <TableHead>유형</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>다음 조치</TableHead>
            <TableHead>피드백</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews.map((interview) => (
            <TableRow key={interview.id}>
              <TableCell className="font-medium">{interview.company}</TableCell>
              <TableCell>{interview.role}</TableCell>
              <TableCell>{interview.applicationDate}</TableCell>
              <TableCell>{interview.interviewDate}</TableCell>
              <TableCell>{interview.type}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(interview.status)}>{interview.status}</Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  {interview.nextAction}
                </Button>
              </TableCell>
              <TableCell>
                {interview.feedback && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{interview.feedback}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>수정</DropdownMenuItem>
                    <DropdownMenuItem>복제</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">삭제</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
