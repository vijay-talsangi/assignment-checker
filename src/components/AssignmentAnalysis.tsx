'use client';

import { CheckCircle, XCircle, Clock, TrendingUp, TrendingDown, Award } from 'lucide-react';

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

interface AssignmentAnalysisProps {
  analysis: AnalysisResult;
}

export default function AssignmentAnalysis({ analysis }: AssignmentAnalysisProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partial':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'missing':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'missing':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      {/* Overall Score */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
        <div className="flex items-center justify-center mb-4">
          <Award className="w-8 h-8 text-blue-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Assignment Analysis</h2>
        </div>
        <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)} mb-2`}>
          {analysis.overallScore}%
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {analysis.completedQuestions} of {analysis.totalQuestions} questions properly answered
        </p>
      </div>

      {/* Questions Analysis */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Question-by-Question Analysis</h3>
        <div className="space-y-3">
          {analysis.questionAnalysis.map((question, index) => (
            <div key={index} className="border dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(question.status)}
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    Question {index + 1}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(question.status)}`}>
                    {question.status}
                  </span>
                </div>
                <div className={`text-lg font-bold ${getScoreColor(question.score)}`}>
                  {question.score}%
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {question.question}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {question.feedback}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <div>
          <div className="flex items-center mb-3">
            <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Areas for Improvement */}
      {analysis.improvements.length > 0 && (
        <div>
          <div className="flex items-center mb-3">
            <TrendingDown className="w-5 h-5 text-orange-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Areas for Improvement</h3>
          </div>
          <ul className="space-y-2">
            {analysis.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start">
                <XCircle className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* General Feedback */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">General Feedback</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {analysis.generalFeedback}
        </p>
      </div>
    </div>
  );
}
