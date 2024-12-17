"use client"

import FileUpload from "@/components/FileUpload"

export default function UploadPage() {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-bold tracking-tight mb-8">Upload Statement</h2>
      <div className="flex-1 h-full w-full flex items-center justify-center">
        <FileUpload onDataProcessed={(data) => console.log(data)} />
      </div>
    </div>
  )
} 