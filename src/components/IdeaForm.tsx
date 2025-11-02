import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/database.types'

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

    try {
      setLoading(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('ユーザーが認証されていません')

      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

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
      alert('アイデアの保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow-md border border-border space-y-4">
      <h2 className="text-xl font-bold">
        {editingIdea ? 'アイデアを編集' : '新しいアイデア'}
      </h2>

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          タイトル
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="アイデアのタイトル"
          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          内容
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="アイデアの詳細を記述..."
          rows={4}
          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="actionType" className="block text-sm font-medium mb-2">
          実装方法
        </label>
        <select
          id="actionType"
          value={actionType}
          onChange={(e) => setActionType(e.target.value as ActionType)}
          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loading}
        >
          <option value="build_app">アプリ化する</option>
          <option value="use_existing">既存ツールで補完</option>
          <option value="pending">保留</option>
        </select>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-2">
          タグ（カンマ区切り）
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="例: アイデア, 便利ツール, 週末開発"
          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loading}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? '保存中...' : editingIdea ? '更新' : '追加'}
        </button>
        {editingIdea && (
          <button
            type="button"
            onClick={() => {
              resetForm()
              onCancel()
            }}
            disabled={loading}
            className="px-6 bg-muted text-muted-foreground py-2 rounded-md font-medium hover:bg-muted/80 disabled:opacity-50 transition-colors"
          >
            キャンセル
          </button>
        )}
      </div>
    </form>
  )
}
