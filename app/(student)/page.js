import Image from "next/image";
import { ArrowRight, BookOpen, Brain, Camera, Lock, Users } from 'lucide-react'
import Link from "next/link";


export default function Home() {
  return (
    
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Secure Online Examination System
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Revolutionizing remote testing with advanced AI-based proctoring
          </p>
        </div>

        <div className="mt-20 flex justify-center space-x-6">
          <Link
            href="/student"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Student Portal
          </Link>
          <Link
            href="/teacher"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-gray-100 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Teacher Portal
          </Link>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<Brain className="h-6 w-6" />}
              title="AI-Based Proctoring"
              description="Advanced algorithms detect and prevent cheating in real-time"
            />
            <Feature
              icon={<Camera className="h-6 w-6" />}
              title="360° Monitoring"
              description="Comprehensive surveillance of the test environment"
            />
            <Feature
              icon={<Lock className="h-6 w-6" />}
              title="Secure Platform"
              description="End-to-end encryption for all exam data and communications"
            />
            <Feature
              icon={<Users className="h-6 w-6" />}
              title="Multi-User Support"
              description="Seamless experience for both students and teachers"
            />
            <Feature
              icon={<BookOpen className="h-6 w-6" />}
              title="Diverse Question Types"
              description="Support for multiple choice, essay coding questions"
            />
            <Feature
              icon={<ArrowRight className="h-6 w-6" />}
              title="Real-Time Results"
              description="Instant grading and feedback for objective questions"
            />
          </div>
        </div>
        
      </main>
    
  );
}


function Feature({ icon, title, description }) {
  return (
    <div className="pt-6">
      <div className="flow-root bg-gray-200 rounded-lg px-6 pb-8">
        <div className="-mt-6">
          <div>
            <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
              {icon}
            </span>
          </div>
          <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{title}</h3>
          <p className="mt-5 text-base text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  )
}