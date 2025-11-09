/**
 * アイデアメモ機能の型定義
 */

export type ActionType = 'build_app' | 'use_existing' | 'pending'

export interface Idea {
  id: string
  user_id: string
  title: string
  content: string
  action_type: ActionType
  tags: string[]
  created_at: string
  updated_at: string
}

export interface IdeaInput {
  title: string
  content: string
  action_type: ActionType
  tags?: string[]
}

export interface IdeaFilters {
  action_type?: ActionType
  tags?: string[]
  searchQuery?: string
}

// ビューモードの型定義
export type ViewMode = 'grid' | 'list' | 'compact' | 'table'

// ソートオプションの型定義
export type SortField = 'title' | 'created_at' | 'updated_at' | 'action_type'
export type SortOrder = 'asc' | 'desc'

export interface SortOptions {
  field: SortField
  order: SortOrder
}
