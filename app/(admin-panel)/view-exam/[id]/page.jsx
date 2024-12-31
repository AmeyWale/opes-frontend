"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft } from 'lucide-react'

// Mock data for an exam (replace with actual data fetching in a real application)
const mockExam = { 
  id: 1, 
  title: 'Mathematics Midterm', 
  date: '2024-03-15', 
  startTime: '09:00', 
  endTime: '11:00',
  totalStudents: 50,
  submittedCount: 48,
  passedCount: 40,
  averageScore: 78.5
}

// Mock data for student submissions 
const mockStudentSubmissions = [
  { id: 1, name: 'Alice Johnson', score: 85, passed: true, submissionTime: '2024-03-15 10:45' },
  { id: 2, name: 'Bob Smith', score: 72, passed: true, submissionTime: '2024-03-15 10:55' },
  { id: 3, name: 'Charlie Brown', score: 68, passed: false, submissionTime: '2024-03-15 10:58' },
  { id: 4, name: 'Diana Prince', score: 95, passed: true, submissionTime: '2024-03-15 10:30' },
  { id: 5, name: 'Ethan Hunt', score: 78, passed: true, submissionTime: '2024-03-15 10:50' },
]

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export default function ExamDetails({id}) {
  
    const router = useRouter();

  const [exam, setExam] = useState(null)
  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    
    async function fetchExamDetails() {
      try {
        
        let response = await fetch(`${BACKEND_URL}/api/exams/${id}`)

      } catch (error) {
        console.error(error.message)
      }
    }

    setExam(mockExam)
    setSubmissions(mockStudentSubmissions)
  }, [id])

  if (!exam) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin Panel
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{exam.title}</CardTitle>
            <CardDescription>
              Date: {exam.date} | Time: {exam.startTime} - {exam.endTime}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Exam Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Total Students: {exam.totalStudents}</p>
                  <p>Submissions: {exam.submittedCount}</p>
                  <p>Passed: {exam.passedCount}</p>
                  <p>Average Score: {exam.averageScore.toFixed(2)}%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Submission Rate: {((exam.submittedCount / exam.totalStudents) * 100).toFixed(2)}%</p>
                  <p>Pass Rate: {((exam.passedCount / exam.submittedCount) * 100).toFixed(2)}%</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Student Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submission Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <Link href={`/student-submission/${exam.id}/${submission.id}`} className="text-blue-600 hover:underline">
                            {submission.name}
                          </Link>
                        </TableCell>
                        <TableCell>{submission.score}%</TableCell>
                        <TableCell>{submission.passed ? 'Passed' : 'Failed'}</TableCell>
                        <TableCell>{submission.submissionTime}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}