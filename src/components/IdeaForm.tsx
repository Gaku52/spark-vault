import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/database.types'
import { ideaSchema } from '../schemas/ideaSchema'

type Idea = Database['public']['Tables']['ideas']['Row']
type ActionType = Database['public']['Tables']['ideas']['Row']['action_type']

interface IdeaFormProps {
  onSuccess: () => void
  editingIdea: Idea | null
  onCancel: () => void
}

export function IdeaForm({ onSuccess, editingIdea, onCancel }: IdeaFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [actionType, setActionType] = useState<ActionType>('pending')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingIdea) {
      setTitle(editingIdea.title)
      setContent(editingIdea.content)
      setActionType(editingIdea.action_type)
      setTags(editingIdea.tags.join(', '))
    } else {
      resetForm()
    }
  }, [editingIdea])

  const resetForm = () => {
    setTitle('')
    setContent('')
    setActionType('pending')
    setTags('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      setLoading(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('ユーザーが認証されていません')

      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      // Zod検証
      const validationResult = ideaSchema.safeParse({
        title,
        content,
        action_type: actionType,
        tags: tagsArray
      })

      if (!validationResult.success) {
        const fieldErrors: Record<string, string> = {}
        validationResult.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message
          }
        })
        setErrors(fieldErrors)
        return
      }

      const ideaData = {
        title,
        content,
        action_type: actionType,
        tags: tagsArray,
        user_id: user.id,
      }

      if (editingIdea) {
        // 更新
        const { error } = await supabase
          .from('ideas')
          .update(ideaData)
          .eq('id', editingIdea.id)

        if (error) throw error
      } else {
        // 新規作成
        const { error } = await supabase.from('ideas').insert([ideaData])

        if (error) throw error
      }

      resetForm()
      onCancel()
      onSuccess()
    } catch (error) {
      console.error('Error saving idea:', error)
      setErrors({ submit: 'アイデアの保存に失敗しました' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-border/50 space-y-5 animate-scaleIn">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {editingIdea ? 'アイデアを編集' : '新しいひらめき'}
        </h2>
      </div>

      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-semibold text-foreground mb-2">
          タイトル
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="アイデアのタイトルを入力..."
          className={`w-full px-4 py-3 border rounded-xl bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all-smooth placeholder:text-muted-foreground/50 ${
            errors.title ? 'border-red-500' : 'border-border'
          }`}
          required
          disabled={loading}
        />
        {errors.title && (
          <p className="text-xs text-red-600">• {errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-semibold text-foreground mb-2">
          内容
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="アイデアの詳細を記述してください..."
          rows={4}
          className={`w-full px-4 py-3 border rounded-xl bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all-smooth resize-none placeholder:text-muted-foreground/50 ${
            errors.content ? 'border-red-500' : 'border-border'
          }`}
          required
          disabled={loading}
        />
        {errors.content && (
          <p className="text-xs text-red-600">• {errors.content}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="actionType" className="block text-sm font-semibold text-foreground mb-2">
            実装方法
          </label>
          <select
            id="actionType"
            value={actionType}
            onChange={(e) => setActionType(e.target.value as ActionType)}
            className="w-full px-4 py-3 border border-border rounded-xl bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all-smooth appearance-none cursor-pointer"
            disabled={loading}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.25rem'
            }}
          >
            <option value="build_app">🚀 アプリ化する</option>
            <option value="use_existing">🔧 既存ツールで補完</option>
            <option value="pending">⏸️ 保留</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="tags" className="block text-sm font-semibold text-foreground mb-2">
            タグ（カンマ区切り）
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="例: アイデア, 便利ツール"
            className={`w-full px-4 py-3 border rounded-xl bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all-smooth placeholder:text-muted-foreground/50 ${
              errors.tags ? 'border-red-500' : 'border-border'
            }`}
            disabled={loading}
          />
          {errors.tags && (
            <p className="text-xs text-red-600">• {errors.tags}</p>
          )}
        </div>
      </div>

      {errors.submit && (
        <div className="p-4 rounded-xl text-sm text-center bg-red-50 text-red-700 border border-red-200 animate-fadeIn">
          {errors.submit}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all-smooth transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              保存中...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {editingIdea ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  更新する
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  追加する
                </>
              )}
            </span>
          )}
        </button>
        {editingIdea && (
          <button
            type="button"
            onClick={() => {
              resetForm()
              onCancel()
            }}
            disabled={loading}
            className="px-8 bg-muted/50 text-muted-foreground py-3 rounded-xl font-semibold hover:bg-muted disabled:opacity-50 transition-all-smooth hover:scale-[1.02] active:scale-[0.98]"
          >
            キャンセル
          </button>
        )}
      </div>
    </form>
  )
}
