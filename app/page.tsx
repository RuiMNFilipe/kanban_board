import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-blue-200 to-blue-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 min-h-screen flex items-center justify-center py-12">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 dark:text-blue-400 mb-6 tracking-tight">
          Organize Your Tasks, Achieve Your Goals.
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Unlock seamless task management with our intuitive Kanban board.
          Collaborate effortlessly, track progress visually, and boost your
          productivity.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              Get Started for Free
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button className="hover:cursor-pointer" variant="outline">
              Log In
            </Button>
          </Link>
        </div>

        {/* Optional: Add some visually appealing graphics or illustrations here */}
        <div className="mt-12">
          {/* You could insert an image or a simple SVG illustration */}
          {/* <img src="/landing-illustration.svg" alt="Kanban Board Illustration" className="max-w-lg mx-auto" /> */}
          <div className="max-w-lg mx-auto">
            <div className="bg-blue-100 dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
                Key Features
              </h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li>Visual Task Management</li>
                <li>Drag and Drop Interface</li>
                <li>Real-time Collaboration (if applicable)</li>
                <li>Customizable Boards and Columns</li>
                <li>Progress Tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
