/**
 * 思考法記録機能の型定義
 */

export type ThinkingRecordType = 'pattern' | 'decision' | 'iq_tracking'

export interface IQFactors {
  sleep: number
  nutrition: number
  exercise: number
  stress: number
}

export interface ThinkingRecord {
  id: string
  user_id: string
  type: ThinkingRecordType
  date: string
  title: string
  description: string
  iq_level: number | null
  factors: IQFactors | null
  outcome: string | null
  learnings: string
  action_items: string[]
  created_at: string
}

export interface ThinkingRecordInput {
  type: ThinkingRecordType
  date: string
  title: string
  description: string
  iq_level?: number
  factors?: IQFactors
  outcome?: string
  learnings: string
  action_items: string[]
}
