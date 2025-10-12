# AI Assignment Evaluator

A beautiful chat interface for analyzing handwritten student assignments using AI. Upload PDF files of handwritten assignments and get instant AI-powered analysis with detailed feedback.

## Features

- 🤖 **AI-Powered Analysis**: Uses Google's Gemini AI to analyze handwritten assignments
- 📄 **PDF Processing**: Extracts text from PDF files automatically
- 💬 **Chat Interface**: Clean, modern chat UI similar to ChatGPT/Claude
- 📊 **Detailed Feedback**: 
  - Overall score and completion percentage
  - Question-by-question analysis
  - Strengths and areas for improvement
  - Detailed feedback for each question
- 🎨 **Beautiful UI**: Modern gradient design with dark mode support
- 📱 **Responsive**: Works on desktop and mobile devices
- 🔒 **No Auth Required**: Simple upload and analyze workflow

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd aies
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get Google AI API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key

4. **Configure Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Add your Google AI API key:
     ```
     GOOGLE_AI_API_KEY=your_actual_api_key_here
     ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Upload a PDF of a handwritten assignment
   - Get instant AI analysis!

## How It Works

1. **Upload**: Drag and drop or click to upload a PDF file
2. **Extract**: The app extracts text from the PDF using pdf-parse
3. **Analyze**: Google's Gemini AI analyzes the content and provides detailed feedback
4. **Display**: Results are shown in a beautiful, easy-to-read format

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **AI**: Google Generative AI (Gemini)
- **PDF Processing**: pdf-parse
- **Deployment**: Vercel-ready

## Project Structure

```
src/
├── app/
│   ├── api/analyze-assignment/
│   │   └── route.ts          # API endpoint for assignment analysis
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
└── components/
    ├── ChatInterface.tsx     # Main chat interface component
    └── AssignmentAnalysis.tsx # Analysis results display component
```

## Features in Detail

### Assignment Analysis
- **Overall Score**: Percentage score based on completion and quality
- **Question Status**: Each question marked as complete, partial, or missing
- **Detailed Feedback**: Specific feedback for each question
- **Strengths**: What the student did well
- **Improvements**: Areas that need work
- **General Feedback**: Overall assessment and recommendations

### User Experience
- **Drag & Drop**: Easy file upload with visual feedback
- **Real-time Updates**: Loading states and instant results
- **Chat History**: Previous analyses remain visible
- **Responsive Design**: Works on all screen sizes
- **Dark Mode**: Automatic dark mode support

## Customization

You can easily customize the analysis prompts by editing the prompt in `/src/app/api/analyze-assignment/route.ts`. Modify the evaluation criteria, scoring system, or feedback format to match your specific needs.

## Deployment

This app is ready to deploy on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `GOOGLE_AI_API_KEY` environment variable in Vercel
4. Deploy!

## Limitations

- Currently supports PDF files only
- Requires clear, readable handwritten text
- Analysis quality depends on the clarity of the scanned document
- Rate limited by Google AI API quotas

## Future Enhancements

- Support for image files (JPG, PNG)
- OCR integration for better handwriting recognition
- Multiple language support
- Export analysis results
- Teacher dashboard for managing multiple assignments
- Student progress tracking

## Contributing

Feel free to contribute to this project by submitting issues or pull requests!
