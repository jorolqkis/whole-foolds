import { useMemo, useState } from 'react'
import type { NutrientOption } from '../utils/export'
import { Button } from './ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

type NutrientColumnPickerProps = {
  options: NutrientOption[]
  selectedKeys: string[]
  onSelect: (key: string) => void
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m5 7 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function NutrientColumnPicker({ options, selectedKeys, onSelect }: NutrientColumnPickerProps) {
  const [open, setOpen] = useState(false)

  const availableOptions = useMemo(
    () => options.filter((option) => !selectedKeys.includes(option.key)),
    [options, selectedKeys],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full justify-between rounded-2xl bg-[rgba(25,24,37,0.9)] px-4 text-sm font-medium"
        >
          <span>{availableOptions.length > 0 ? 'Select a nutrient' : 'No more nutrients available'}</span>
          <ChevronIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search nutrients..." />
          <CommandList>
            <CommandEmpty>No nutrient found.</CommandEmpty>
            <CommandGroup>
              {availableOptions.map((option) => (
                <CommandItem
                  key={option.key}
                  value={`${option.label} ${option.shortLabel}`}
                  onSelect={() => {
                    onSelect(option.key)
                    setOpen(false)
                  }}
                  className="justify-between gap-3"
                >
                  <span className="truncate">{option.label}</span>
                  {selectedKeys.includes(option.key) ? <CheckIcon /> : null}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
