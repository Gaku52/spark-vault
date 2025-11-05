import type { Database } from '../lib/database.types'

type ActionType = Database['public']['Tables']['ideas']['Row']['action_type']

export const ACTION_TYPES = {
  build_app: {
    label: 'アプリ化する',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    icon: '🚀'
  },
  use_existing: {
    label: '既存ツールで補完',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: '🔧'
  },
  pending: {
    label: '保留',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: '⏸️'
  }
} as const

export const FILTER_BUTTONS = [
  { value: 'all' as const, label: 'すべて' },
  { value: 'build_app' as ActionType, label: 'アプリ化する' },
  { value: 'use_existing' as ActionType, label: '既存ツールで補完' },
  { value: 'pending' as ActionType, label: '保留' }
] as const

export const ERROR_MESSAGES = {
  FETCH_FAILED: 'アイデアの取得に失敗しました',
  DELETE_FAILED: '削除に失敗しました',
  CREATE_FAILED: 'アイデアの保存に失敗しました',
  UPDATE_FAILED: '更新に失敗しました'
} as const
