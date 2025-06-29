"use client"

import { Check, X } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface Improvement {
  id: number
  task: string
  completed: boolean
}

interface UpdateTrackerProps {
  improvements: Improvement[]
}

export function UpdateTracker({ improvements }: UpdateTrackerProps) {
  const completedCount = improvements.filter((imp) => imp.completed).length
  const totalCount = improvements.length

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between bg-transparent">
          <span className="text-sm font-medium">
            Planned Improvements ({completedCount}/{totalCount})
          </span>
          <div className="flex items-center gap-1">
            {completedCount === totalCount && totalCount > 0 ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <X className="h-4 w-4 text-orange-600" />
            )}
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 mt-2">
        {improvements.map((improvement) => (
          <div key={improvement.id} className="flex items-center space-x-2 p-2 border rounded">
            <Checkbox id={`improvement-${improvement.id}`} checked={improvement.completed} disabled />
            <label
              htmlFor={`improvement-${improvement.id}`}
              className={`text-sm flex-1 ${improvement.completed ? "line-through text-muted-foreground" : ""}`}
            >
              {improvement.task}
            </label>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
