import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/database.types'
import type { SortField, SortOrder } from '../types/idea'

type Idea = Database['public']['Tables']['ideas']['Row']

interface UseIdeasOptions {
  searchQuery?: string
  sortField?: SortField
  sortOrder?: SortOrder
}

export function useIdeas(options: UseIdeasOptions = {}) {
  const {
    searchQuery = '',
    sortField = 'created_at',
    sortOrder = 'desc'
  } = options
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

      if (fetchError) throw fetchError

      setIdeas(data || [])
    } catch (err) {
      console.error('Error fetching ideas:', err)
      setError('アイデアの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [])

  // ソートとフィルタリングを適用
  const filteredAndSortedIdeas = useMemo(() => {
    let result = [...ideas]

    // 検索フィルター
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (idea) =>
          idea.title.toLowerCase().includes(query) ||
          idea.content.toLowerCase().includes(query) ||
          idea.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // ソート
    result.sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title, 'ja')
          break
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        case 'updated_at':
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
          break
        case 'action_type':
          comparison = a.action_type.localeCompare(b.action_type)
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [ideas, searchQuery, sortField, sortOrder])

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
    ideas: filteredAndSortedIdeas,
    loading,
    error,
    refresh: fetchIdeas,
    deleteIdea
  }
}
