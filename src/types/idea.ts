/**
 * アイデアメモ機能の型定義
 */

export type IdeaCategory = 'dj' | 'engineer' | 'health' | 'thinking' | 'other'
export type IdeaPriority = 'high' | 'medium' | 'low'

export interface Idea {
  id: string
  user_id: string
  title: string
  content: string
  category: IdeaCategory
  tags: string[]
  priority: IdeaPriority
  created_at: string
  updated_at: string
}

export interface IdeaInput {
  title: string
  content: string
  category: IdeaCategory
  tags: string[]
  priority: IdeaPriority
}

export interface IdeaFilters {
  category?: IdeaCategory
  tags?: string[]
  priority?: IdeaPriority
  searchQuery?: string
}
