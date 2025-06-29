"use client"

import { ProjectCard } from "./project-card"

interface ProjectGridProps {
  projects: any[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.length === 0 && (
        <p className="text-muted-foreground col-span-full">아직 프로젝트가 없습니다. 새로운 프로젝트를 추가해보세요.</p>
      )}
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
