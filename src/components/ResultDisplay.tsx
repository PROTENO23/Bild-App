interface ResultDisplayProps {
  imageUrl: string | null
  isLoading: boolean
  error: string | null
}

export default function ResultDisplay({ imageUrl, isLoading, error }: ResultDisplayProps) {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-500" />
          <p className="text-sm font-medium text-gray-500">Processing...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="max-w-sm text-sm text-red-500">{error}</p>
        </div>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt="Generated result"
          className="max-h-[500px] max-w-full rounded-xl object-contain shadow-md"
        />
      ) : (
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-400">Your result will appear here</p>
        </div>
      )}
    </div>
  )
}
