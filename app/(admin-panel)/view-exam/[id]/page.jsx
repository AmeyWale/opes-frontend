"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft } from 'lucide-react'
import Cookies from 'js-cookie'
import { formatDateTime } from '@/lib/utils'

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

export default function ExamDetails({params}) {
  
  const router = useRouter();
  const [exam, setExam] = useState(null)
  const [submissions, setSubmissions] = useState([])
  
  const id = params.id;
  console.log(id);
  
  useEffect(() => {
    
    async function fetchExamDetails() {
      try {
        
        let response = await fetch(`${BACKEND_URL}/api/exams/analytics/${id}`,
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
        setExam(data)
        
      } catch (error) {
        console.error(error.message)
      }
    }
    fetchExamDetails()
    // setExam(mockExam)
    // setSubmissions(mockStudentSubmissions)
  }, [id])

  function handleDownloadCSV() {
    if (!exam?.submissions?.length) return;

    const headers = ["Unique Id", "Phone Number", "Name", "Score", "Status", "Submission Time"];
    const rows = exam.submissions.map(sub => [
      sub.uniqueId,
      sub.phone,
      sub.name,
      sub.score,
      sub.status,
      formatDateTime(sub.submissionTime)
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${exam.examInfo.title.replace(/\s+/g, "_")}_submissions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


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
              From: {formatDateTime(exam.examInfo.startTime)} To: {formatDateTime(exam.examInfo.endTime)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Exam Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Total Students: {exam.statistics.totalStudents}</p>
                  <p>Submissions: {exam.statistics.totalSubmissions}</p>
                  <p>Passed: {exam.statistics.passedStudents}</p>
                  <p>Average Score: {exam.statistics.averageScore} </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Submission Rate: {exam.overview.submissionRate}</p>
                  <p>Pass Rate: {exam.overview.passRate}</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Student Submissions</CardTitle>
                <Button onClick={handleDownloadCSV} variant="outline" className="text-sm">
                  Download CSV
                </Button>
              </div>
            </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unique Id</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submission Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exam.submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>{submission.uniqueId}</TableCell>
                        <TableCell>{submission.phone}</TableCell>
                        <TableCell>
                          <Link href={`/student-submission/${id}/${submission.id}`} className="text-blue-600 hover:underline">
                            {submission.name}
                          </Link>
                        </TableCell>
                        <TableCell>{submission.score}</TableCell>
                        <TableCell>{submission.status}</TableCell>
                        <TableCell>{formatDateTime(submission.submissionTime)}</TableCell>
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