/**
 * 健康管理機能の型定義
 */

export type HealthRecordType = 'health' | 'exercise' | 'meal'

export interface HealthRecord {
  id: string
  user_id: string
  type: HealthRecordType
  date: string
  sleep_hours: number | null
  sleep_quality: number | null
  energy_level: number | null
  mental_state: string | null
  exercise_type: string | null
  exercise_duration: number | null
  exercise_intensity: number | null
  meal_content: string | null
  notes: string
  created_at: string
}

export interface HealthRecordInput {
  type: HealthRecordType
  date: string
  sleep_hours?: number
  sleep_quality?: number
  energy_level?: number
  mental_state?: string
  exercise_type?: string
  exercise_duration?: number
  exercise_intensity?: number
  meal_content?: string
  notes: string
}
