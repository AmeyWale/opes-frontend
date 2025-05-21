"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import Cookies from 'js-cookie'
import { getAnswerStatus, formatDateTime } from '@/lib/utils'
import { Dialog, DialogContent,DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

// Mock data for submission
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

export default function StudentSubmission({ params } ) {
  const router = useRouter()
  let {examId, studentId} = params;
  const [submission, setSubmission] = useState(null)

  useEffect(() => {

    async function fetchStudentSubmissionDetails() {
      try {
        
        let response = await fetch(`${BACKEND_URL}/api/students/${studentId}/details`,
          { 
            headers:{
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Cookies.get("token")}`
            }
          }
        )
        const data = await response.json();

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${data.message}`);
        }
        console.log(data);    
        setSubmission(data.data)
      } catch (error) {
        console.error(error.message)
      }
    }
    fetchStudentSubmissionDetails()
    
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

          <div className="mt-4 flex  items-center justify-between ">
            <div className="text-sm text-muted-foreground">
              Student: {submission.studentName} | Score: {submission.score} | Status: {submission.status}
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={submission.violations.length > 0 ? "text-amber-600" : ""}
                >
                  <AlertTriangle className="mr-1 h-4 w-4" />
                  Violations: {submission.violations.length}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Exam Violations</DialogTitle>
                  <DialogDescription>
                    The following violations were detected during the exam
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
                  {submission.violations.length === 0 ? (
                    <p className="text-center py-4 text-muted-foreground">No violations detected</p>
                  ) : (
                    <div className="space-y-4">
                      {submission.violations.map((violation, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="text-sm text-muted-foreground">
                            {formatDateTime(violation.timestamp)}
                          </div>
                          <div className="font-medium mt-1">{violation.reason}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
                        {getAnswerStatus(answer.isCorrect)}
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