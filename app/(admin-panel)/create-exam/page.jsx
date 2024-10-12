"use client"

import { useState } from 'react'
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
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Trash2 } from 'lucide-react'

export default function CreateExam() {
  const router = useRouter()
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration: 60,
    passingScore: 60,
    randomizeQuestions: false,
    allowBacktracking: true,
    showResults: true,
    questions: []
  })

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
      ? { type, question: '', options: ['', '', '', ''], correctAnswer: '' }
      : { type, question: '' }
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
    // Here you would typically send the exam data to your backend
    console.log(examData)
    useToast({
      title: "Exam Created",
      description: "Your exam has been created successfully.",
    })
    // Redirect to the admin panel or exam list page
    // router.push('/teacher/admin-panel')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Exam</CardTitle>
          <CardDescription>Set up your exam details and questions</CardDescription>
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
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Slider
                    id="duration"
                    min={15}
                    max={180}
                    step={15}
                    value={[examData.duration]}
                    onValueChange={handleSliderChange('duration')}
                  />
                  <div className="text-sm text-gray-500">{examData.duration} minutes</div>
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
                  <Card key={index}>
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
            <Button type="submit" className="w-full">Create Exam</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}