/**
 * DJ成長記録機能の型定義
 */

export type DJRecordType = 'skill' | 'mix' | 'performance'

export interface SkillRatings {
  mixing: number
  equipment: number
  selection: number
  playback: number
  audienceReading: number
}

export interface DJRecord {
  id: string
  user_id: string
  type: DJRecordType
  date: string
  title: string
  description: string
  skill_ratings: SkillRatings | null
  equipment: string[]
  track_list: string[] | null
  venue: string | null
  reflections: string
  created_at: string
}

export interface DJRecordInput {
  type: DJRecordType
  date: string
  title: string
  description: string
  skill_ratings?: SkillRatings
  equipment: string[]
  track_list?: string[]
  venue?: string
  reflections: string
}
