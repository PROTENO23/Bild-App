# AI Image Blender

## Setup
```
npm install
cp .env.example .env   # then set your VITE_WEBHOOK_URL
npm run dev
```

## Stack
- React + TypeScript + Vite
- Tailwind CSS v4 (via @tailwindcss/vite plugin)
- n8n webhook for Gemini image processing

## Environment Variables
- `VITE_WEBHOOK_URL` — n8n webhook endpoint (required, set in `.env`)

## Project Structure
- `src/App.tsx` — Main layout, upload state, webhook fetch logic
- `src/components/FileUpload.tsx` — Drag-and-drop image upload with preview
- `src/components/ResultDisplay.tsx` — Result image / loading / error states
