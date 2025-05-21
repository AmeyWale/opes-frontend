"use client";
import Link from 'next/link';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ConfirmationPage() {

  const searchParams = useSearchParams();
  const passedParam = searchParams.get('passed');

  useEffect(()=>{
    async function stopTracking() {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      try {
        const camera = await navigator.mediaDevices.getUserMedia({ video: true })
        camera.getTracks().forEach(track => track.stop())
      } catch (err) {
      }

      try {
        const mic = await navigator.mediaDevices.getUserMedia({ audio: true })
        mic.getTracks().forEach(track => track.stop())
      } catch (err) {
      }
    }
    stopTracking()
  },[])

  let resultMessage = '';
  if (passedParam === 'true') {
    resultMessage = 'Congratulations! You have passed the exam.';
  } else if (passedParam === 'false') {
    resultMessage = 'Unfortunately, you did not pass this time.';
  }

  return (
    <div className="flex items-center justify-center mt-10 ">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-semibold text-green-600 mb-4">Test Submitted Successfully</h1>
        <p className="text-gray-600 mb-6">Your test has been submitted. Thank you for your participation!</p>

        {resultMessage && (
          <p className={`mb-6 ${passedParam === 'true' ? 'text-green-500' : 'text-red-500'}`}>
            {resultMessage}
          </p>
        )}

        <Link href="/">
          Return Home
        </Link>
      </div>
    </div>
  );
}
