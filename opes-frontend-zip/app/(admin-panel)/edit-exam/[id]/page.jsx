"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ErrorDialog } from '@/components/Error'
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { PlusCircle, Trash2, ArrowLeft } from 'lucide-react'
import Cookies from 'js-cookie'
import { formatDateTimeLocal, formatDuration } from '@/lib/utils'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

function isExamEnded(endTimeInput){
  const endTime = new Date(endTimeInput);
  const now = new Date();
  return now > endTime;
}

function isExamStarted(startTimeInput){
  const startTime = new Date(startTimeInput);
  const now = new Date();
  return now > startTime;
}

export default function EditExam({params}) {
  const router = useRouter()
  const assessmentId = params.id;
  const [examData, setExamData] = useState(null)
  const [error, setError] = useState(null)
  const [hasExamStarted, sethasExamStarted] = useState(false);

  useEffect(() => {
    
    async function fetchExamDetails() {
      try {
        
        let response = await fetch(`${BACKEND_URL}/api/teachers/exams/${assessmentId}`,
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
        let isEnded = isExamEnded(data.endTime)
        if (isEnded){
          throw new Error("Cannot edit an exam which has ended");
        }

        let hasStarted = isExamStarted(data.startTime);
        sethasExamStarted(hasStarted)
        console.log(data);
        

        setExamData(data)
      } catch (error) {
        setError(error)
        // console.error(error.message)
      }
    }
    fetchExamDetails()
    
  }, [assessmentId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    console.log(name, value);
    
    setExamData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name) => (checked) => {
    setExamData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSliderChange = (name) => (value) => {
    setExamData(prev => ({ ...prev, [name]: value[0] }))
  }

  const addQuestion = (type) => {
    const newQuestion = type === 'mcq' 
      ? { id: Date.now(), type, question: '', options: ['', '', '', ''], correctAnswer: '' }
      : { id: Date.now(), type, question: '' }
    setExamData(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }))
  }

  const updateQuestion = (index, field, value) => {
    setExamData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === index ? { ...q, [field]: value } : q)
    }))
  }

  const removeQuestion = (index) => {
    setExamData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(examData)

    try {
      const response = await fetch(`${BACKEND_URL}/api/exams/${assessmentId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'authorization':`Bearer ${Cookies.get("token")}`
          },
        body: JSON.stringify(examData),
      })
      const data = await response.json()
      console.log(data);
      
      if (!response.ok) {
        throw new Error(`Failed to update exam. ${data.error}`)
      }

      console.log(data)
      
      router.push('/teacher-admin-panel')
    } catch (err) {
      setError(err)
    }
    
  } 

  if (!examData && error == null) {
    return <div>Loading...</div>
  }
  


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin Panel
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Exam</CardTitle>
            <CardDescription>Update your exam details and questions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className={`grid w-full ${!hasExamStarted ? "grid-cols-3" :  "grid-cols-2"}`}>
                  <TabsTrigger value="general">General</TabsTrigger>
                  {!hasExamStarted && <TabsTrigger value="questions">Questions</TabsTrigger>}
                  {/* <TabsTrigger value="questions">Questions</TabsTrigger> */}
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Exam Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={examData?.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={examData?.description}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                  {!hasExamStarted && <div className="space-y-2">
                    <Label htmlFor="startTime">Exam Start Date and Time</Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="datetime-local"
                      defaultValue={formatDateTimeLocal(examData?.startTime)}
                      onChange={handleInputChange}
                      required
                    />
                  </div>}
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Exam End Date and Time</Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="datetime-local"
                      defaultValue={formatDateTimeLocal(examData?.endTime)}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </TabsContent>
                {!hasExamStarted && <TabsContent value="questions" className="space-y-4">
                  <div className="flex justify-between">
                    <Button type="button" onClick={() => addQuestion('mcq')}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add MCQ
                    </Button>
                    <Button type="button" onClick={() => addQuestion('essay')}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Essay Question
                    </Button>
                  </div>
                  {examData?.questions.map((question, index) => (
                    <Card key={question.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeQuestion(index)}
                          className="absolute top-2 right-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Label htmlFor={`question-${index}`}>Question</Label>
                          <Textarea
                            id={`question-${index}`}
                            value={question.question}
                            onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                            rows={2}
                          />
                        </div>
                        {question.type === 'mcq' && (
                          <div className="mt-4 space-y-2">
                            <Label>Options</Label>
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <Input
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...question.options]
                                    newOptions[optionIndex] = e.target.value
                                    updateQuestion(index, 'options', newOptions)
                                  }}
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                                <Checkbox
                                  checked={question.correctAnswer === option}
                                  onCheckedChange={() => updateQuestion(index, 'correctAnswer', option)}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>}
                <TabsContent value="settings" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="randomizeQuestions">Randomize Questions</Label>
                    <Switch
                      id="randomizeQuestions"
                      checked={examData?.randomizeQuestionSequence}
                      onCheckedChange={handleSwitchChange('randomizeQuestionSequence')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showResults">Show Results Immediately</Label>
                    <Switch
                      id="showResults"
                      checked={examData?.showResult}
                      onCheckedChange={handleSwitchChange('showResult')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passingScore">Passing Score (%)</Label>
                    <Slider
                      id="passingScore"
                      min={0}
                      max={100}
                      step={5}
                      value={[examData?.passingScore]}
                      onValueChange={handleSliderChange('passingScore')}
                    />
                    <div className="text-sm text-gray-500">{examData?.passingScore}%</div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Slider
                      id="duration"
                      min={900} // 15 minutes
                      max={10800} // 3 hours
                      step={900} // 15-minute steps
                      value={[examData?.duration]}
                      onValueChange={handleSliderChange('duration')}
                    />
                    <div className="text-sm text-gray-500">
                      {formatDuration(examData?.duration)}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <Button type="submit" className="w-full">Update Exam</Button>
            </form>
          </CardContent>
        </Card>
        <ErrorDialog error={error} onClose={() => router.push('/teacher-admin-panel')} />
      </div>
    </div>
  )
}