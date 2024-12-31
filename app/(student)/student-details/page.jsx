"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorDialog } from '@/components/Error'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export default function StudentRegistration() {
  const router = useRouter()

  const [error, setError] = useState()

  const [formData, setFormData] = useState({
    uniqueId: "",
    name: "",
    branch: "",
    class: "",
    yearOfStudy: "",
    email: "",
    phoneNumber: "",
    collegeName: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, yearOfStudy: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    let payload = {...formData};

    let examData = JSON.parse(localStorage.getItem("exam"))
    payload.assessmentId = examData.assessmentId
    
    try {
      let response = await fetch(`${BACKEND_URL}/api/students/register`,{
        method:"POST",
        headers: { 
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(payload)
      })

      let data = await response.json()

      if (!response.ok){
        throw new Error(data.message);
      }
      localStorage.setItem("student",JSON.stringify(data.data))
      router.push('/student-verify')
    } catch (error) {
      setError(error)
    }    
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Student Registration</CardTitle>
          <CardDescription>Please fill in your details to register for the exam.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="uniqueId">Unique ID</Label>
              <Input
                id="uniqueId"
                name="uniqueId"
                placeholder="Enter your unique ID"
                value={formData.uniqueId}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Input
                id="branch"
                name="branch"
                placeholder="Enter your branch"
                value={formData.branch}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Input
                id="class"
                name="class"
                placeholder="Enter your class"
                value={formData.class}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearOfStudy">Year of Study</Label>
              <Select onValueChange={handleSelectChange} value={formData.yearOfStudy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year of study" />
                </SelectTrigger>
                <SelectContent>
                  {["1", "2", "3", "4", "5"].map((year) => (
                    <SelectItem key={year} value={year}>
                      Year {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter your 10-digit phone number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                pattern="[0-9]{10}"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collegeName">College Name</Label>
              <Input
                id="collegeName"
                name="collegeName"
                placeholder="Enter your college name"
                value={formData.collegeName}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">Register</Button>
          </form>
        </CardContent>
      </Card>
      <ErrorDialog error={error} onClose={() => setError(null)} />
    </div>
  )
}