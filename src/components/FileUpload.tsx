import { useCallback, useRef, useState } from 'react'

interface FileUploadProps {
  label: string
  description: string
  file: File | null
  onFileSelect: (file: File) => void
}

export default function FileUpload({ label, description, file, onFileSelect }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (f: File) => {
      if (f.type.startsWith('image/')) {
        onFileSelect(f)
      }
    },
    [onFileSelect],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const f = e.dataTransfer.files[0]
      if (f) handleFile(f)
    },
    [handleFile],
  )

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback(() => setIsDragging(false), [])

  const preview = file ? URL.createObjectURL(file) : null

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`
        relative cursor-pointer rounded-2xl border-2 border-dashed p-8
        transition-all duration-200 ease-in-out
        flex flex-col items-center justify-center gap-3 min-h-[260px]
        ${isDragging
          ? 'border-indigo-500 bg-indigo-50/50'
          : file
            ? 'border-gray-200 bg-white'
            : 'border-gray-200 bg-gray-50/50 hover:border-indigo-300 hover:bg-indigo-50/30'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />

      {preview ? (
        <div className="flex flex-col items-center gap-3">
          <img
            src={preview}
            alt="Preview"
            className="max-h-40 max-w-full rounded-xl object-contain shadow-sm"
          />
          <p className="text-sm text-gray-500">Click or drop to replace</p>
        </div>
      ) : (
        <>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-gray-800">{label}</p>
            <p className="mt-1 text-sm text-gray-400">{description}</p>
          </div>
        </>
      )}
    </div>
  )
}
