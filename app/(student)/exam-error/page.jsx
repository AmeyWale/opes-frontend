'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(()=>{
      async function stopTracking() {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      }
      stopTracking()
    },[])

  return (
    <div className="flex flex-col items-center justify-center mt-10 p-4">
      <h1 className="text-3xl font-bold mb-4 text-red-600">An error occured while submitting the exam</h1>
      {error ? (
        <p className="text-lg text-gray-700">{error}</p>
      ) : (
        <p className="text-lg text-gray-500">No error message provided.</p>
      )}
    </div>
  );
}
