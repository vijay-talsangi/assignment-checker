'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Send, FileText, CheckCircle, XCircle, Clock, Bot, User, Loader2 } from 'lucide-react';
import AssignmentAnalysis from './AssignmentAnalysis';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  analysis?: AnalysisResult;
  fileName?: string;
}

interface AnalysisResult {
  overallScore: number;
  completedQuestions: number;
  totalQuestions: number;
  strengths: string[];
  improvements: string[];
  questionAnalysis: QuestionAnalysis[];
  generalFeedback: string;
}

interface QuestionAnalysis {
  question: string;
  status: 'complete' | 'partial' | 'missing';
  feedback: string;
  score: number;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: 'Hello! I\'m your AI assignment evaluator. Upload a PDF of a handwritten assignment and I\'ll analyze it for you, checking if all questions are properly answered and providing detailed feedback.',
        timestamp: new Date(),
      }
    ]);
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes('pdf')) {
      alert('Please upload a PDF file');
      return;
    }

    setIsLoading(true);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Uploaded assignment: ${file.name}`,
      timestamp: new Date(),
      fileName: file.name,
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // Create FormData and send to API
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze-assignment', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze assignment');
      }

      const analysis: AnalysisResult = await response.json();

      // Add AI response message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I\'ve analyzed the assignment! Here\'s my detailed evaluation:',
        timestamp: new Date(),
        analysis,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error analyzing assignment:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error while analyzing the assignment. Please make sure you\'ve uploaded a clear PDF file and try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-3xl ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user'
                    ? 'bg-blue-500 ml-3'
                    : 'bg-gray-500 mr-3'
                }`}
              >
                {message.type === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.fileName && (
                  <div className="flex items-center mt-2 text-xs opacity-80">
                    <FileText className="w-4 h-4 mr-1" />
                    {message.fileName}
                  </div>
                )}
                {isClient && (
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Analysis Results */}
        {messages
          .filter(m => m.analysis)
          .map(message => (
            <AssignmentAnalysis
              key={`analysis-${message.id}`}
              analysis={message.analysis!}
            />
          ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Analyzing assignment...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div className="border-t dark:border-gray-600 p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload Assignment PDF
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Drag and drop your PDF here, or click to browse
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Choose PDF File
          </button>
        </div>
      </div>
    </div>
  );
}
