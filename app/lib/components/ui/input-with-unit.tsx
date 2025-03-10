"use client"

import * as React from "react"
import { cn } from "@/app/lib/utils/utils"

interface InputWithUnitProps extends React.InputHTMLAttributes<HTMLInputElement> {
  unit: string
  className?: string
  containerClassName?: string
  unitClassName?: string
}

export const InputWithUnit = React.forwardRef<HTMLInputElement, InputWithUnitProps>(
  ({ className, unit, containerClassName, unitClassName, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center", containerClassName)}>
        <input
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-8",
            className,
          )}
          ref={ref}
          {...props}
        />
        <div className={cn("absolute right-2 text-sm text-muted-foreground pointer-events-none", unitClassName)}>
          {unit}
        </div>
      </div>
    )
  },
)

InputWithUnit.displayName = "InputWithUnit"