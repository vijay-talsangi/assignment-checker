'use client';

import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            AI Assignment Evaluator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Upload handwritten assignments and get instant AI-powered analysis
          </p>
        </div>
        <ChatInterface />
      </div>
    </div>
  );
}
