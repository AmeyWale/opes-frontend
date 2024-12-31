"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Camera, Mic, MapPin, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from 'next/navigation'


export default function PreExamVerification() {
  const [cameraPermission, setCameraPermission] = useState(null)
  const [micPermission, setMicPermission] = useState(null)
  const [locationPermission, setLocationPermission] = useState(null)
  const [rulesAccepted, setRulesAccepted] = useState(false)

  const router = useRouter()
  useEffect(() => {
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    try {
      const camera = await navigator.mediaDevices.getUserMedia({ video: true })
      setCameraPermission(true)
      camera.getTracks().forEach(track => track.stop())
    } catch (err) {
      setCameraPermission(false)
    }

    try {
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true })
      setMicPermission(true)
      mic.getTracks().forEach(track => track.stop())
    } catch (err) {
      setMicPermission(false)
    }

    try {
      await navigator.geolocation.getCurrentPosition(() => {
        setLocationPermission(true)
      })
    } catch (err) {
      setLocationPermission(false)
    }
  }

  const requestPermission = async (type) => {
    if (type === 'camera' || type === 'mic') {
      try {
        await navigator.mediaDevices.getUserMedia({
          video: type === 'camera',
          audio: type === 'mic'
        })
        type === 'camera' ? setCameraPermission(true) : setMicPermission(true)
      } catch (err) {
        type === 'camera' ? setCameraPermission(false) : setMicPermission(false)
      }
    } else if (type === 'location') {
      try {
        await navigator.geolocation.getCurrentPosition(() => {
          setLocationPermission(true)
        })
      } catch (err) {
        setLocationPermission(false)
      }
    }
  }

  const startExam = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().then(() => {
        router.push("/exam")
      }).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err)
      })
    } else {
      // Fallback for browsers that don't support fullscreen
    }
  }

  const allPermissionsGranted = cameraPermission && micPermission && locationPermission
  const canStartExam = allPermissionsGranted && rulesAccepted

  return (
    <div className="min-h-screen bg-gray-200 p-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Pre-Exam Verification</CardTitle>
          <CardDescription>Please grant the required permissions and accept the rules to start your exam.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Required Permissions</h3>
            <PermissionItem
              icon={<Camera className="h-4 w-4" />}
              label="Camera"
              granted={cameraPermission}
              onRequest={() => requestPermission('camera')}
            />
            <PermissionItem
              icon={<Mic className="h-4 w-4" />}
              label="Microphone"
              granted={micPermission}
              onRequest={() => requestPermission('mic')}
            />
            <PermissionItem
              icon={<MapPin className="h-4 w-4" />}
              label="Location"
              granted={locationPermission}
              onRequest={() => requestPermission('location')}
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Exam Rules and Regulations</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Ensure you are in a quiet, well-lit room with no one else present.</li>
              <li>Your face must be visible on camera at all times during the exam.</li>
              <li>No additional devices or materials are allowed unless specified.</li>
              <li>Do not leave your seat or the camera frame during the exam.</li>
              <li>Any suspicious behavior may result in exam termination.</li>
              <li>In case of technical issues, contact support immediately.</li>
            </ul>
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox id="rules" checked={rulesAccepted} onCheckedChange={setRulesAccepted} />
              <label htmlFor="rules" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I have read and agree to abide by the exam rules and regulations
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={!canStartExam} onClick={startExam}>
            Start Exam
          </Button>
        </CardFooter>
      </Card>
      {!allPermissionsGranted && (
        <Alert variant="destructive" className="mt-4 max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Permissions Required</AlertTitle>
          <AlertDescription>
            Please grant all required permissions to proceed with the exam.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

function PermissionItem({ icon, label, granted, onRequest }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {icon}
        <span>{label}</span>
      </div>
      {granted === null ? (
        <Button variant="outline" size="sm" onClick={onRequest}>
          Request
        </Button>
      ) : granted ? (
        <CheckCircle2 className="h-5 w-5 text-green-500" />
      ) : (
        <Button variant="outline" size="sm" onClick={onRequest}>
          Retry
        </Button>
      )}
    </div>
  )
}