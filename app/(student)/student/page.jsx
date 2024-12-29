"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { BookOpen, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Component() {
  const [assessmentId, setAssessmentId] = useState('')

  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push("/student-details")
    // Handle the submission logic here
    console.log('Assessment ID submitted:', assessmentId)
  }

  return (
    <>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Assessment ID</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assessmentId">Assessment ID</Label>
                  <Input
                    id="assessmentId"
                    type="text"
                    placeholder="Enter your assessment ID"
                    value={assessmentId}
                    onChange={(e) => setAssessmentId(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Start Assessment
                </Button>
              </form>
            </div>
          </div>

            <div className="bg-blue-50 mt-5 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-blue-800 mb-2">Instructions</h2>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Ensure you have a stable internet connection</li>
                <li>Find a quiet, well-lit room for your exam</li>
                <li>Have your student ID ready for verification</li>
                <li>Close all unnecessary applications on your device</li>
                </ul>
            </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
              <BookOpen className="w-12 h-12 text-indigo-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Prepare for Success</h3>
                <p className="text-gray-600">Access study materials and practice tests</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Track Your Progress</h3>
                <p className="text-gray-600">View your assessment history and results</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <Image
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Student studying"
            width={400}
            height={300}
            className="rounded-lg shadow-md"
          />
          <Image
            src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Online learning"
            width={400}
            height={300}
            className="rounded-lg shadow-md"
          />
          <Image
            src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Exam preparation"
            width={400}
            height={300}
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
    </>
  )
}