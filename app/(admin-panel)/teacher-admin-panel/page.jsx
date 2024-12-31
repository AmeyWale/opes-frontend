"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Trash2 } from 'lucide-react'
import Cookies from 'js-cookie'
import { formatDateTime } from '@/lib/utils'

// Mock data for exams 
const mockExams = [
  { 
    id: 1, 
    title: 'Mathematics Midterm', 
    date: '2024-03-15', 
    startTime: '09:00', 
    endTime: '11:00',
    totalStudents: 50,
    submittedCount: 48,
  },
  { 
    id: 2, 
    title: 'Physics Final', 
    date: '2024-05-20', 
    startTime: '10:00', 
    endTime: '13:00',
    totalStudents: 45,
    submittedCount: 45,
  },
  { 
    id: 3, 
    title: 'Computer Science Quiz', 
    date: '2024-04-10', 
    startTime: '14:00', 
    endTime: '15:00',
    totalStudents: 60,
    submittedCount: 58,
  },
]

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export default function TeacherAdminPanel() {
  const router = useRouter()
  const [exams, setExams] = useState(mockExams)

  const handleCreateExam = () => {
    router.push('/create-exam')
  }

  const handleEditExam = (examId) => {
    router.push(`/edit-exam/${examId}`)
  }

  const handleDeleteExam = (examId) => {
    setExams(exams.filter(exam => exam.id !== examId))
  }

  useEffect(()=>{

    async function fetchExams() {
      
      try {
        
        let response = await fetch(`${BACKEND_URL}/api/teachers/exams`,{
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${Cookies.get("token")}`
          },
        })

        let data = await response.json()

        if (!response.ok){
          throw new Error(`HTTP error! Status: ${response.message}`);
        }
        console.log(data);
        
        setExams(data)

      } catch (error) {
        console.error("Error fetching exams : ", error)
      }

    }
    fetchExams();

  },[])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Teacher Admin Panel</CardTitle>
          <CardDescription>Manage your exams and view statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Exams</h2>
            <Button onClick={handleCreateExam}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Exam
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Title</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Assessment ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam._id}>
                  <TableCell className="font-medium">
                    <Link href={`/view-exam/${exam._id}`} className="text-blue-600 hover:underline">
                      {exam.title}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDateTime(exam.startTime)}</TableCell>
                  <TableCell>{formatDateTime(exam.endTime)}</TableCell>
                  <TableCell>{exam.assessmentId}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditExam(exam._id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteExam(exam._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}