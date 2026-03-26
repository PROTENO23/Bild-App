import { useState, useCallback } from 'react'
import FileUpload from './components/FileUpload'
import ResultDisplay from './components/ResultDisplay'

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL as string
const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD as string
const WEBHOOK_AUTH_NAME = import.meta.env.VITE_WEBHOOK_AUTH_NAME as string
const WEBHOOK_AUTH_VALUE = import.meta.env.VITE_WEBHOOK_AUTH_VALUE as string

function App() {
  const [image1, setImage1] = useState<File | null>(null)
  const [image2, setImage2] = useState<File | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [isAuthenticated, setIsAuthenticated] = useState(!APP_PASSWORD)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === APP_PASSWORD) {
      setIsAuthenticated(true)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  const handleSubmit = useCallback(async () => {
    if (!image1 || !image2) return

    setIsLoading(true)
    setError(null)
    setResultUrl(null)

    try {
      const formData = new FormData()
      formData.append('image1', image1)
      formData.append('image2', image2)

      const headers: Record<string, string> = {}
      if (WEBHOOK_AUTH_NAME && WEBHOOK_AUTH_VALUE) {
        headers[WEBHOOK_AUTH_NAME] = WEBHOOK_AUTH_VALUE
      }

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers,
        body: formData,
      })

      const contentType = response.headers.get('content-type') || ''

      // If the response is an image, display it
      if (contentType.startsWith('image/')) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setResultUrl(url)
        return
      }

      // Otherwise, try to extract a useful error message from the body
      const text = await response.text()
      let detail = text
      try {
        const json = JSON.parse(text)
        detail = json.message || json.error || JSON.stringify(json, null, 2)
      } catch {
        // plain text is fine
      }
      throw new Error(detail || 'The webhook did not return an image.')
    } catch (err) {
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('Could not reach the webhook. Make sure n8n is running and CORS is allowed.')
      } else if (err instanceof Error) {
        const msg = err.message.toLowerCase()
        const isContentFilter = msg.includes('invalid response') || msg.includes('blocked') || msg.includes('safety') || msg.includes('prohibited')
        setError(
          isContentFilter
            ? 'The image was likely blocked by Gemini\'s content filter. Try using a different image.'
            : err.message
        )
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [image1, image2])

  const canSubmit = image1 && image2 && !isLoading

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/60">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
            AI Image Blender
          </h1>
          <p className="mb-6 text-sm text-gray-400">Enter password to continue</p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false) }}
            placeholder="Password"
            className={`
              w-full rounded-xl border bg-gray-50 px-4 py-3 text-base text-gray-800
              outline-none transition-colors placeholder:text-gray-300
              focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
              ${passwordError ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}
            `}
          />
          {passwordError && (
            <p className="mt-2 text-sm text-red-500">Wrong password</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-600 active:scale-[0.98]"
          >
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="mx-auto max-w-3xl px-5 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
            AI Image Blender
          </h1>
          <p className="mt-3 text-lg text-gray-400">
            Upload two images and let AI merge them into something new.
          </p>
        </div>

        {/* Upload zones */}
        <div className="grid gap-5 sm:grid-cols-2">
          <FileUpload
            label="Base Image"
            description="The person or scene"
            file={image1}
            onFileSelect={setImage1}
          />
          <FileUpload
            label="Clothing Item"
            description="The outfit or object to blend"
            file={image2}
            onFileSelect={setImage2}
          />
        </div>

        {/* Generate button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`
              rounded-xl px-8 py-3.5 text-base font-semibold text-white
              shadow-lg shadow-indigo-500/25 transition-all duration-200
              ${canSubmit
                ? 'bg-indigo-500 hover:bg-indigo-600 hover:shadow-indigo-500/40 active:scale-[0.98]'
                : 'cursor-not-allowed bg-gray-300 shadow-none'
              }
            `}
          >
            {isLoading ? 'Processing...' : 'Generate Image'}
          </button>
        </div>

        {/* Result */}
        <div className="mt-10">
          <ResultDisplay imageUrl={resultUrl} isLoading={isLoading} error={error} />
        </div>
      </div>
    </div>
  )
}

export default App
