"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle } from 'lucide-react'



export function ErrorDialog({ error, onClose }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (error) {
      setIsOpen(true)
    }
  }, [error])

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  if (!error) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center text-destructive">
            <AlertCircle className="mr-2 h-5 w-5" />
            An Error Occurred
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p className="mt-2 text-sm text-gray-500">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
          {error.stack && (
            <pre className="mt-2 max-h-40 overflow-auto rounded bg-gray-100 p-2 text-xs">
              {error.stack}
            </pre>
          )}
        </DialogDescription>
        <DialogFooter>
          <Button onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}