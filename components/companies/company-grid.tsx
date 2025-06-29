"use client"

import { CompanyCard } from "./company-card"

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

interface CompanyGridProps {
  companies: Company[];
}

export function CompanyGrid({ companies }: CompanyGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {companies.length === 0 ? (
        <p className="text-center text-muted-foreground col-span-full">
          표시할 회사 정보가 없습니다.
        </p>
      ) : (
        companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))
      )}
    </div>
  )
}
