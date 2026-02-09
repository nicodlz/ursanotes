import { useAuthStore } from '../stores/auth'
import { Auth } from './Auth'
import { Sidebar } from './Sidebar'
import { EditorContainer } from './Editor'
import { Preview } from './Preview'

function MainLayout() {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className="flex-1 border-r border-[var(--border)] flex flex-col">
          <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
            <span className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editor
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <EditorContainer />
          </div>
        </div>
        
        {/* Preview */}
        <div className="flex-1 flex flex-col bg-[var(--bg-primary)]">
          <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
            <span className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <Preview />
          </div>
        </div>
      </div>
    </div>
  )
}

export function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return <Auth />
  }

  return <MainLayout />
}
