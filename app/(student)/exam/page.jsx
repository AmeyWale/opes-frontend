"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Clock, AlertTriangle, CheckCircle, SkipForward } from 'lucide-react'
import { useRouter } from 'next/navigation'



// Mock questions data
const questions = [
  { id: 1, type: 'mcq', question: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correctAnswer: 'Paris' },
  { id: 2, type: 'descriptive', question: 'Explain the process of photosynthesis.' },
  { id: 3, type: 'mcq', question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctAnswer: 'Mars' },
  { id: 4, type: 'descriptive', question: 'Describe the main themes in Shakespeare\'s "Hamlet".' },
  // Add more questions as needed
]

export default function ExamInterface() {
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [savedAnswers, setSavedAnswers] = useState({})
  const [skippedQuestions, setSkippedQuestions] = useState(new Set())
  const [timeLeft, setTimeLeft] = useState(3600) // 1 hour in seconds
  const [showWarning, setShowWarning] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false)


  const router = useRouter();

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      setWarningMessage('You have left the exam tab. This will be reported.')
      setShowWarning(true)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [handleVisibilityChange])

  useEffect(() => {
    
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            handleSubmitExam()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    
  }, [])

  const handleAnswer = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer
    }))
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleSubmitExam = () => {
    // Here you would typically send the answers to your backend
    console.log('Submitting exam:', savedAnswers)
    // For now, we'll just close the confirmation dialog
    router.push("/submitted")
    setShowSubmitConfirmation(false)
    // In a real application, you'd redirect to a results page or show a completion message
  }

  
  const saveAndNext = () => {
    const currentQuestionId = questions[currentQuestion].id
    setSavedAnswers((prev) => ({
      ...prev,
      [currentQuestionId]: answers[currentQuestionId]
    }))
    setSkippedQuestions((prevSkipped) => {
      const newSkipped = new Set(prevSkipped)
      newSkipped.delete(currentQuestionId)
      return newSkipped
    })
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const skipQuestion = () => {
    setSkippedQuestions((prevSkipped) => new Set(prevSkipped).add(questions[currentQuestion].id))
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const getExamStats = () => {
    const totalQuestions = questions.length
    const answeredQuestions = Object.keys(savedAnswers).length
    const skippedQuestionsCount = skippedQuestions.size
    const unansweredQuestions = totalQuestions - answeredQuestions - skippedQuestionsCount

    return { totalQuestions, answeredQuestions, skippedQuestionsCount, unansweredQuestions }
  }

  const acknowledgeWarning = () => {
    setShowWarning(false)
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err)
      })
    }
  }

  const currentQuestionId = questions[currentQuestion].id
  const isAnswered = !!answers[currentQuestionId]
  const isSaved = !!savedAnswers[currentQuestionId]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Clock className="h-5 w-5 text-gray-500" />
          <span className="font-semibold">{formatTime(timeLeft)}</span>
        </div>
        <Button onClick={() => setShowSubmitConfirmation(true)} variant="destructive">
          Submit Exam
        </Button>
      </header>
      <div className="flex-1 flex">
        <aside className="w-64 bg-white shadow-md p-4">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <h2 className="font-semibold mb-4">Questions</h2>
            {questions.map((q, index) => (
              <Button
                key={q.id}
                variant={currentQuestion === index ? "default" : "outline"}
                className={`w-full mb-2 justify-start  ${savedAnswers[q.id] ? 'bg-green-100 text-black hover:bg-green-200' : ''} ${skippedQuestions.has(q.id) ? 'bg-yellow-100 text-black hover:bg-yellow-200' : ''}`}
                onClick={() => setCurrentQuestion(index)}
              >
                Question {index + 1}
                {savedAnswers[q.id] && <CheckCircle className="ml-2 h-4 w-4" />}
                {skippedQuestions.has(q.id) && <SkipForward className="ml-2 h-4 w-4" />}
              </Button>
            ))}
          </ScrollArea>
        </aside>
        <main className="flex-1 p-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Question {currentQuestion + 1}</h2>
              <p className="mb-4">{questions[currentQuestion].question}</p>
              {questions[currentQuestion].type === 'mcq' ? (
                <RadioGroup
                  value={answers[currentQuestionId] || ''}
                  onValueChange={(value) => handleAnswer(currentQuestionId, value)}
                >
                  {questions[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <Textarea
                  value={answers[currentQuestionId] || ''}
                  onChange={(e) => handleAnswer(currentQuestionId, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full h-40"
                />
              )}
            </CardContent>
          </Card>
          <div className="mt-4 flex justify-between">
            <Button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <div className="space-x-2">
              <Button onClick={skipQuestion} variant="outline">
                Skip
              </Button>
              <Button onClick={saveAndNext} disabled={!isAnswered || isSaved}>
                Save and Next
              </Button>
            </div>
          </div>
        </main>
      </div>
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Warning</AlertDialogTitle>
            <AlertDialogDescription>{warningMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={acknowledgeWarning}>Acknowledge</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showSubmitConfirmation} onOpenChange={setShowSubmitConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your exam? You won't be able to make any changes after submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <CardContent>
            <h3 className="font-semibold mb-2">Exam Statistics:</h3>
            <ul className="list-disc list-inside">
              <li>Total Questions: {getExamStats().totalQuestions}</li>
              <li>Answered Questions: {getExamStats().answeredQuestions}</li>
              <li>Skipped Questions: {getExamStats().skippedQuestionsCount}</li>
              <li>Unanswered Questions: {getExamStats().unansweredQuestions}</li>
            </ul>
          </CardContent>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSubmitConfirmation(false)}>Cancel</AlertDialogAction>
            <AlertDialogAction onClick={handleSubmitExam} className="bg-destructive text-destructive-foreground">
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}