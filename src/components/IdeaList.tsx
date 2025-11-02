import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/database.types'
import { IdeaForm } from './IdeaForm'

type Idea = Database['public']['Tables']['ideas']['Row']
type ActionType = Database['public']['Tables']['ideas']['Row']['action_type']

export function IdeaList() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ActionType | 'all'>('all')
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null)

  const fetchIdeas = useCallback(async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('action_type', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setIdeas(data || [])
    } catch (error) {
      console.error('Error fetching ideas:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchIdeas()
  }, [fetchIdeas])

  const handleDelete = async (id: string) => {
    if (!confirm('このアイデアを削除しますか？')) return

    try {
      const { error } = await supabase.from('ideas').delete().eq('id', id)
      if (error) throw error
      fetchIdeas()
    } catch (error) {
      console.error('Error deleting idea:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const getActionTypeLabel = (actionType: ActionType) => {
    const labels = {
      build_app: 'アプリ化する',
      use_existing: '既存ツールで補完',
      pending: '保留'
    }
    return labels[actionType]
  }

  const getActionTypeColor = (actionType: ActionType) => {
    const colors = {
      build_app: 'bg-purple-100 text-purple-800 border-purple-300',
      use_existing: 'bg-blue-100 text-blue-800 border-blue-300',
      pending: 'bg-gray-100 text-gray-800 border-gray-300'
    }
    return colors[actionType]
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Spark Vault</h1>
            <p className="text-sm text-muted-foreground">ひらめきを即座に記録</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ログアウト
          </button>
        </div>

        {/* Idea Form */}
        <IdeaForm
          onSuccess={fetchIdeas}
          editingIdea={editingIdea}
          onCancel={() => setEditingIdea(null)}
        />

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => setFilter('build_app')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'build_app'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
            }`}
          >
            アプリ化する
          </button>
          <button
            onClick={() => setFilter('use_existing')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'use_existing'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
          >
            既存ツールで補完
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            保留
          </button>
        </div>

        {/* Ideas List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">読み込み中...</div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            アイデアがありません。上のフォームから追加してください。
          </div>
        ) : (
          <div className="space-y-4">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="bg-card p-4 rounded-lg shadow-sm border border-border space-y-3"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <h3 className="font-bold text-lg">{idea.title}</h3>
                    <p className="text-foreground whitespace-pre-wrap">{idea.content}</p>

                    <div className="flex gap-2 items-center flex-wrap">
                      <span className={`text-xs px-3 py-1 rounded-full border ${getActionTypeColor(idea.action_type)}`}>
                        {getActionTypeLabel(idea.action_type)}
                      </span>
                      {idea.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {idea.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {new Date(idea.created_at).toLocaleString('ja-JP')}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingIdea(idea)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(idea.id)}
                      className="text-sm text-destructive hover:text-destructive/80 font-medium"
                    >
                      削除
                    </button>
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
