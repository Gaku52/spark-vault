import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/database.types'

type Idea = Database['public']['Tables']['ideas']['Row']

interface UseIdeasOptions {
  searchQuery?: string
}

export function useIdeas(options: UseIdeasOptions = {}) {
  const { searchQuery = '' } = options
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIdeas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      // クライアントサイドで検索フィルタリング（シンプル）
      let filteredData = data || []
      if (searchQuery) {
        filteredData = filteredData.filter(idea =>
          idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          idea.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      }

      setIdeas(filteredData)
    } catch (err) {
      console.error('Error fetching ideas:', err)
      setError('アイデアの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    fetchIdeas()
  }, [fetchIdeas])

  const deleteIdea = async (id: string) => {
    try {
      const { error } = await supabase.from('ideas').delete().eq('id', id)
      if (error) throw error

      // 楽観的UI更新（再フェッチ不要）
      setIdeas(prev => prev.filter(idea => idea.id !== id))
    } catch (err) {
      console.error('Error deleting idea:', err)
      setError('削除に失敗しました')
      throw err
    }
  }

  return {
    ideas,
    loading,
    error,
    refresh: fetchIdeas,
    deleteIdea
  }
}
