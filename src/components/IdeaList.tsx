import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/database.types'
import { IdeaForm } from './IdeaForm'
import { UpdatePassword } from './UpdatePassword'
import { useIdeas } from '../hooks/useIdeas'
import { ACTION_TYPES, FILTER_BUTTONS } from '../constants/ideas'

type Idea = Database['public']['Tables']['ideas']['Row']
type ActionType = Database['public']['Tables']['ideas']['Row']['action_type']

export function IdeaList() {
  const [filter, setFilter] = useState<ActionType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null)
  const [showPasswordChange, setShowPasswordChange] = useState(false)

  const { ideas, loading, refresh, deleteIdea } = useIdeas({ filter, searchQuery })

  const handleDelete = async (id: string) => {
    if (!confirm('このアイデアを削除しますか？')) return

    try {
      await deleteIdea(id)
    } catch (error) {
      console.error('Error deleting idea:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
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
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="flex-1 sm:flex-none px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all-smooth"
            >
              パスワード変更
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 sm:flex-none px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all-smooth"
            >
              ログアウト
            </button>
          </div>
        </div>

        {/* Password Change */}
        {showPasswordChange && (
          <UpdatePassword
            onSuccess={() => setShowPasswordChange(false)}
            onCancel={() => setShowPasswordChange(false)}
          />
        )}

        {/* Idea Form */}
        {!showPasswordChange && (
          <IdeaForm
            onSuccess={refresh}
            editingIdea={editingIdea}
            onCancel={() => setEditingIdea(null)}
          />
        )}

        {/* Search & Filter */}
        <div className="space-y-4 animate-slideIn">
          {/* Search Bar */}
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

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {FILTER_BUTTONS.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-4 sm:px-6 py-2.5 rounded-xl font-medium transition-all-smooth transform hover:scale-105 ${
                  filter === btn.value
                    ? btn.value === 'all'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30'
                      : btn.value === 'build_app'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                      : btn.value === 'use_existing'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gradient-to-r from-gray-600 to-gray-500 text-white shadow-lg shadow-gray-500/30'
                    : btn.value === 'all'
                    ? 'bg-muted/50 text-muted-foreground hover:bg-muted backdrop-blur-sm'
                    : btn.value === 'build_app'
                    ? 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                    : btn.value === 'use_existing'
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
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
            <p className="text-lg text-muted-foreground mb-2">アイデアがありません</p>
            <p className="text-sm text-muted-foreground">上のフォームから新しいひらめきを記録しましょう</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
            {ideas.map((idea, index) => (
              <div
                key={idea.id}
                className="bg-card/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-md border border-border/50 space-y-4 card-hover animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-lg sm:text-xl text-foreground flex-1 leading-tight">
                      {idea.title}
                    </h3>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => setEditingIdea(idea)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all-smooth hover:scale-110"
                        aria-label="編集"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(idea.id)}
                        className="p-2 text-destructive hover:bg-red-50 rounded-lg transition-all-smooth hover:scale-110"
                        aria-label="削除"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <p className="text-foreground/80 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                    {idea.content}
                  </p>

                  <div className="flex gap-2 items-center flex-wrap pt-2">
                    <span className={`text-xs sm:text-sm px-3 py-1.5 rounded-full border font-medium ${ACTION_TYPES[idea.action_type].color} transition-all-smooth hover:scale-105`}>
                      {ACTION_TYPES[idea.action_type].icon} {ACTION_TYPES[idea.action_type].label}
                    </span>
                    {idea.tags.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        {idea.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs px-2.5 py-1 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-lg font-medium transition-all-smooth hover:scale-105 hover:shadow-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-muted-foreground">
                      {new Date(idea.created_at).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
