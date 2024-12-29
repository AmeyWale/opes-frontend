"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft } from 'lucide-react'

// Mock data for a student's submission (replace with actual data fetching in a real application)
const mockSubmission = {
  examId: 1,
  examTitle: 'Mathematics Midterm',
  studentId: 1,
  studentName: 'Alice Johnson',
  score: 85,
  passed: true,
  submissionTime: '2024-03-15 10:45',
  answers: [
    { questionNumber: 1, question: 'What is 2 + 2?', studentAnswer: '4', correctAnswer: '4', isCorrect: true },
    { questionNumber: 2, question: 'What is the square root of 16?', studentAnswer: '4', correctAnswer: '4', isCorrect: true },
    { questionNumber: 3, question: 'Solve for x: 2x + 5 = 13', studentAnswer: 'x = 4', correctAnswer: 'x = 4', isCorrect: true },
    { questionNumber: 4, question: 'What is the area of a circle with radius 3?', studentAnswer: '28.26', correctAnswer: '28.27', isCorrect: false },
    { questionNumber: 5, question: 'What is the derivative of x^2?', studentAnswer: '2x', correctAnswer: '2x', isCorrect: true },
  ]
}

export default function StudentSubmission({ examId, studentId } ) {
  const router = useRouter()

  const [submission, setSubmission] = useState(null)

  useEffect(() => {
    // In a real application, fetch the student's submission based on examId and studentId
    // For now, we'll use the mock data
    setSubmission(mockSubmission)
  }, [examId, studentId])

  if (!submission) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Exam Details
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{submission.examTitle}</CardTitle>
            <CardDescription>
              Student: {submission.studentName} | Score: {submission.score}% | Status: {submission.passed ? 'Passed' : 'Failed'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Student's Answer</TableHead>
                  <TableHead>Correct Answer</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submission.answers.map((answer) => (
                  <TableRow key={answer.questionNumber}>
                    <TableCell>
                      <div className="font-medium">Question {answer.questionNumber}</div>
                      <div className="text-sm text-gray-500">{answer.question}</div>
                    </TableCell>
                    <TableCell>{answer.studentAnswer}</TableCell>
                    <TableCell>{answer.correctAnswer}</TableCell>
                    <TableCell>
                      <span className={answer.isCorrect ? "text-green-600" : "text-red-600"}>
                        {answer.isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}