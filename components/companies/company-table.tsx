"use client"

import { MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

interface Company {
  id: number
  name: string
  industry: string
  size: string
  location: string
  salaryRange: string
  preparationStatus: number
  skillMatch: number
  lastUpdated: string
}

interface CompanyTableProps {
  companies: Company[]
}

export function CompanyTable({ companies }: CompanyTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Salary Range</TableHead>
            <TableHead>Preparation</TableHead>
            <TableHead>Skill Match</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                표시할 회사 정보가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.industry}</TableCell>
                <TableCell>{company.size}</TableCell>
                <TableCell>{company.location}</TableCell>
                <TableCell>{company.salaryRange}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={company.preparationStatus} className="w-16 h-2" />
                    <span className="text-sm text-muted-foreground">{company.preparationStatus}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      company.skillMatch >= 80 ? "default" : company.skillMatch >= 60 ? "secondary" : "destructive"
                    }
                  >
                    {company.skillMatch}%
                  </Badge>
                </TableCell>
                <TableCell>{company.lastUpdated}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
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
