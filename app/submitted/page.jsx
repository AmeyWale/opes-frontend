
import Link from 'next/link';

export default function ConfirmationPage() {
  return (
    <div className="flex items-center justify-center mt-10 ">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-semibold text-green-600 mb-4">Test Submitted Successfully</h1>
        <p className="text-gray-600 mb-6">Your test has been submitted. Thank you for your participation!</p>
        <Link href="/">
          Return Home
        </Link>
      </div>
    </div>
  );
}
