"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { PDFParser } from './PDFParser'

interface Transaction {
  Date: string;
  Type: string;
  Amount: string;
  Description: string;
  TransactionID?: string;
  UTR?: string;
  PaymentMethod?: string;
}

type FileUploadProps = {
  onFileUpload: (data: Transaction[]) => void
}

type Stage = 'idle' | 'uploading' | 'parsing' | 'processing' | 'complete' | 'error'

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [stage, setStage] = useState<Stage>('idle')
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setStage('idle')
    }
  }

  const handleUpload = async () => {
    if (!file) return;
    
    if (!file.type || !file.type.includes('pdf')) {
      setError('Please upload a valid PDF file');
      return;
    }

    setStage('uploading')
    setError(null)
    setProgress(0)

    try {
      setProgress(25)
      console.log('Starting file upload...');
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate upload time
      
      setStage('parsing')
      setProgress(50)
      console.log('Starting PDF parsing...');
      const parsedData = await PDFParser.parsePDF(file)
      
      setStage('processing')
      setProgress(75)
      console.log('PDF parsed successfully. Processing data...');
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate processing time
      
      if (parsedData.length === 0) {
        throw new Error("No transactions found in the PDF. Please check if it's a valid PhonePe statement.")
      }
      
      setStage('complete')
      setProgress(100)
      console.log('Data processing complete.');
      onFileUpload(parsedData)
    } catch (error) {
      console.error('Error processing PDF:', error)
      setStage('error')
      if (error instanceof Error) {
        if (error.message.includes('Password required')) {
          setError('This PDF is password protected. Please provide the password and try again.')
        } else if (error.message.includes('does not allow content extraction')) {
          setError('This PDF has restrictions that prevent content extraction. Please check the PDF permissions.')
        } else {
          setError(error.message)
        }
      } else {
        setError('An unknown error occurred while processing the PDF.')
      }
    }
  }

  return (
    <motion.div 
      className="flex flex-col items-center space-y-4 w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 w-full"
      />
      <Button 
        onClick={handleUpload} 
        disabled={!file || stage !== 'idle'}
        className="w-full"
      >
        {stage === 'idle' ? 'Upload and Analyze' : 'Processing...'}
      </Button>
      {stage !== 'idle' && stage !== 'error' && (
        <motion.div 
          className="w-full"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-center mt-2">{stage.charAt(0).toUpperCase() + stage.slice(1)}...</p>
        </motion.div>
      )}
      {error && (
        <motion.div 
          className="w-full"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </motion.div>
  )
}

