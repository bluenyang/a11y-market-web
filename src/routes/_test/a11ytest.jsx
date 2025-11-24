// src/routes/a11ytest.jsx
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import A11yOverlay from '@/components/A11y/A11yOverlay'

export const Route = createFileRoute('/_test/a11ytest')({
  component: RouteComponent,
})

function RouteComponent() {
  const [open, setOpen] = useState(true)

  return (
    <main className="p-6 font-kakao-big">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded border bg-white hover:bg-gray-100"
      >
        접근성 메뉴 열기
      </button>

      {/* 오버레이 */}
      <A11yOverlay open={open} onClose={() => setOpen(false)} />
    </main>
  )
}
