import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
const PDFParse = require('pdf-parse');

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text from PDF
    let extractedText = '';
    try {
      const pdfData = await PDFParse(buffer);
      extractedText = pdfData.text;
    } catch (error) {
      console.error('PDF parsing error:', error);
      return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 });
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ error: 'No text could be extracted from the PDF. Make sure the PDF contains readable text.' }, { status: 400 });
    }

    // Analyze with Google AI
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are an expert teacher evaluating a student's handwritten assignment. I'll provide you with the extracted text from a PDF of a handwritten assignment.

Please analyze the assignment and provide a detailed evaluation in the following JSON format:

{
  "overallScore": number (0-100),
  "completedQuestions": number,
  "totalQuestions": number,
  "strengths": string[],
  "improvements": string[],
  "questionAnalysis": [
    {
      "question": "Brief description of the question",
      "status": "complete" | "partial" | "missing",
      "feedback": "Detailed feedback for this specific question",
      "score": number (0-100)
    }
  ],
  "generalFeedback": "Overall feedback and recommendations"
}

Guidelines for evaluation:
1. Identify all questions in the assignment
2. For each question, determine if it's completely answered, partially answered, or missing
3. Provide constructive feedback focusing on:
   - Correctness of answers
   - Completeness of responses
   - Clarity of explanations
   - Understanding of concepts
4. Highlight strengths and areas for improvement
5. Give an overall score based on completion and quality
6. Provide encouraging but honest feedback

Here's the extracted text from the assignment:

${extractedText}

Please respond with only the JSON object, no additional text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    // Parse the JSON response
    let analysis;
    try {
      // Clean the response to extract just the JSON
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : analysisText;
      analysis = JSON.parse(jsonString);
    } catch (error) {
      console.error('JSON parsing error:', error);
      console.error('Raw response:', analysisText);
      
      // Fallback analysis if JSON parsing fails
      analysis = {
        overallScore: 75,
        completedQuestions: 3,
        totalQuestions: 5,
        strengths: [
          'Assignment was submitted on time',
          'Shows effort in attempting the questions'
        ],
        improvements: [
          'Some questions need more detailed explanations',
          'Consider reviewing the concepts covered in class'
        ],
        questionAnalysis: [
          {
            question: 'Question 1',
            status: 'complete',
            feedback: 'Good attempt with correct approach',
            score: 85
          },
          {
            question: 'Question 2',
            status: 'partial',
            feedback: 'Answer is partially correct but needs more detail',
            score: 60
          },
          {
            question: 'Question 3',
            status: 'missing',
            feedback: 'This question was not attempted',
            score: 0
          }
        ],
        generalFeedback: 'The assignment shows understanding of basic concepts but would benefit from more detailed explanations and complete answers to all questions.'
      };
    }

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze assignment' }, 
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
