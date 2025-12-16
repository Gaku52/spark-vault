import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/database.types'
import type { ViewMode, SortField, SortOrder } from '../types/idea'
import type { Session } from '@supabase/supabase-js'
import { IdeaForm } from './IdeaForm'
import { UpdatePassword } from './UpdatePassword'
import { Settings } from './Settings'
import { Auth } from './Auth'
import { ViewToolbar } from './ViewToolbar'
import { IdeaDetailModal } from './IdeaDetailModal'
import { GridView } from './views/GridView'
import { ListView } from './views/ListView'
import { CompactView } from './views/CompactView'
import { TableView } from './views/TableView'
import { useIdeas } from '../hooks/useIdeas'

type Idea = Database['public']['Tables']['ideas']['Row']

export function IdeaList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showGuestBanner, setShowGuestBanner] = useState(true)
  const [isFormCollapsed, setIsFormCollapsed] = useState(() => {
    // localStorageから折りたたみ状態を復元（デフォルトは展開）
    const saved = localStorage.getItem('sparkVault_formCollapsed')
    return saved === 'true'
  })
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('spark-vault-view-mode')
    return (saved as ViewMode) || 'grid'
  })
  const [sortField, setSortField] = useState<SortField>(() => {
    const saved = localStorage.getItem('spark-vault-sort-field')
    return (saved as SortField) || 'created_at'
  })
  const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
    const saved = localStorage.getItem('spark-vault-sort-order')
    return (saved as SortOrder) || 'desc'
  })

  const { ideas, loading, refresh, deleteIdea } = useIdeas({ searchQuery, sortField, sortOrder })

  // セッション取得
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 折りたたみ状態をlocalStorageに保存
  useEffect(() => {
    localStorage.setItem('sparkVault_formCollapsed', String(isFormCollapsed))
  }, [isFormCollapsed])

  // 設定をlocalStorageに保存
  useEffect(() => {
    localStorage.setItem('spark-vault-view-mode', viewMode)
  }, [viewMode])

  useEffect(() => {
    localStorage.setItem('spark-vault-sort-field', sortField)
  }, [sortField])

  useEffect(() => {
    localStorage.setItem('spark-vault-sort-order', sortOrder)
  }, [sortOrder])

  // ショートカットキー (Ctrl/Cmd + N) で折りたたみトグル
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        setIsFormCollapsed(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleFormCollapse = () => {
    setIsFormCollapsed(prev => !prev)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('このアイデアを削除しますか？')) return

    try {
      await deleteIdea(id)
    } catch (error) {
      console.error('Error deleting idea:', error)
    }
  }

  const isGuest = session?.user?.is_anonymous || session?.user?.user_metadata?.is_guest

  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortField(field)
    setSortOrder(order)
  }

  const renderIdeasView = () => {
    switch (viewMode) {
      case 'grid':
        return <GridView ideas={ideas} onEdit={setEditingIdea} onDelete={handleDelete} />
      case 'list':
        return <ListView ideas={ideas} onIdeaClick={setSelectedIdea} />
      case 'compact':
        return <CompactView ideas={ideas} onIdeaClick={setSelectedIdea} />
      case 'table':
        return <TableView ideas={ideas} onIdeaClick={setSelectedIdea} onEdit={setEditingIdea} onDelete={handleDelete} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Spark Vault
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">ひらめきを即座に記録し、未来を創造する</p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all-smooth"
            title="設定"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Guest Banner */}
        {isGuest && showGuestBanner && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-start justify-between gap-3 animate-slideIn">
            <div className="flex-1">
              <p className="text-sm text-indigo-900">
                現在ゲストモードで使用中です。
                <button
                  onClick={() => setShowSettings(true)}
                  className="ml-1 text-indigo-600 hover:text-indigo-800 underline font-medium"
                >
                  ログイン / 登録
                </button>
                すると、データをバックアップして複数端末で同期できます。
              </p>
            </div>
            <button
              onClick={() => setShowGuestBanner(false)}
              className="text-indigo-400 hover:text-indigo-600 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Password Change */}
        {showPasswordChange && (
          <UpdatePassword
            onSuccess={() => setShowPasswordChange(false)}
            onCancel={() => setShowPasswordChange(false)}
          />
        )}

        {/* Idea Form - Collapsible */}
        {!showPasswordChange && (
          <div className="animate-slideIn">
            {/* Collapsible Header */}
            <button
              onClick={toggleFormCollapse}
              className="w-full bg-gradient-to-br from-card to-card/50 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-border/50 flex items-center justify-between hover:shadow-2xl transition-all-smooth group mb-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                    新しいひらめき
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                    {isFormCollapsed ? 'クリックまたは Ctrl+N で展開' : 'クリックまたは Ctrl+N で折りたたみ'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 sm:hidden">
                    {isFormCollapsed ? 'タップで展開' : 'タップで折りたたみ'}
                  </p>
                </div>
              </div>
              <div className={`transition-transform duration-300 ${isFormCollapsed ? '' : 'rotate-180'}`}>
                <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Form Content */}
            {!isFormCollapsed && (
              <div className="animate-scaleIn">
                <IdeaForm
                  onSuccess={refresh}
                  editingIdea={editingIdea}
                  onCancel={() => setEditingIdea(null)}
                />
              </div>
            )}
          </div>
        )}

        {/* Search & View Controls */}
        <div className="space-y-4 animate-slideIn">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="アイデアを検索..."
              className="w-full px-4 py-3 pl-12 border border-border rounded-xl bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all-smooth placeholder:text-muted-foreground/50"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <ViewToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortField={sortField}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Ideas List */}
        {loading ? (
          <div className="text-center py-16 animate-pulse">
            <div className="inline-block h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4"></div>
            <p className="text-muted-foreground">読み込み中...</p>
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-16 animate-fadeIn">
            <div className="inline-block p-6 bg-muted/30 rounded-full mb-4">
              <svg className="w-16 h-16 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-lg text-muted-foreground mb-2">
              {searchQuery ? '検索結果がありません' : 'アイデアがありません'}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? '検索キーワードを変更してみてください' : '上のフォームから新しいひらめきを記録しましょう'}
            </p>
          </div>
        ) : (
          renderIdeasView()
        )}
      </div>

      {/* Detail Modal */}
      <IdeaDetailModal
        idea={selectedIdea}
        onClose={() => setSelectedIdea(null)}
        onEdit={setEditingIdea}
        onDelete={handleDelete}
      />

      {/* Settings Modal */}
      {showSettings && (
        <Settings
          onShowAuth={() => {
            setShowSettings(false)
            setShowAuthModal(true)
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">ログイン / 登録</h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <Auth initialMode="signup" onSuccess={() => setShowAuthModal(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
