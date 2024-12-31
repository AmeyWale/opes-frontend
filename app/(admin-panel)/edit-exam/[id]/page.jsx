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
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { PlusCircle, Trash2, ArrowLeft } from 'lucide-react'

// Mock exam data 
const mockExam = {
  id: 1,
  title: 'Mathematics Midterm',
  description: 'Midterm exam covering chapters 1-5',
  startDate: '2024-03-15T09:00',
  endDate: '2024-03-15T11:00',
  passingScore: 60,
  randomizeQuestions: false,
  showResults: true,
  questions: [
    { id: 1, type: 'mcq', question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correctAnswer: '4' },
    { id: 2, type: 'essay', question: 'Explain the Pythagorean theorem.' },
  ]
}

export default function EditExam({id}) {
  const router = useRouter()
  
  const [examData, setExamData] = useState(mockExam)

  useEffect(() => {
    
    setExamData(mockExam)
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
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
    
    router.push('/teacher-admin-panel')
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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Exam Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={examData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={examData.description}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Exam Start Date and Time</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="datetime-local"
                      value={examData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Exam End Date and Time</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="datetime-local"
                      value={examData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </TabsContent>
                <TabsContent value="questions" className="space-y-4">
                  <div className="flex justify-between">
                    <Button type="button" onClick={() => addQuestion('mcq')}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add MCQ
                    </Button>
                    <Button type="button" onClick={() => addQuestion('essay')}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Essay Question
                    </Button>
                  </div>
                  {examData.questions.map((question, index) => (
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
                </TabsContent>
                <TabsContent value="settings" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="randomizeQuestions">Randomize Questions</Label>
                    <Switch
                      id="randomizeQuestions"
                      checked={examData.randomizeQuestions}
                      onCheckedChange={handleSwitchChange('randomizeQuestions')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showResults">Show Results Immediately</Label>
                    <Switch
                      id="showResults"
                      checked={examData.showResults}
                      onCheckedChange={handleSwitchChange('showResults')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passingScore">Passing Score (%)</Label>
                    <Slider
                      id="passingScore"
                      min={0}
                      max={100}
                      step={5}
                      value={[examData.passingScore]}
                      onValueChange={handleSliderChange('passingScore')}
                    />
                    <div className="text-sm text-gray-500">{examData.passingScore}%</div>
                  </div>
                </TabsContent>
              </Tabs>
              <Button type="submit" className="w-full">Update Exam</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}