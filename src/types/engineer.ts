/**
 * エンジニア自己管理機能の型定義
 */

export type EngineerRecordType = 'learning' | 'project' | 'skill'
export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'blocked'

export interface EngineerRecord {
  id: string
  user_id: string
  type: EngineerRecordType
  date: string
  title: string
  description: string
  technologies: string[]
  hours: number | null
  proficiency: number | null
  status: ProjectStatus | null
  resources: string[] | null
  notes: string
  created_at: string
}

export interface EngineerRecordInput {
  type: EngineerRecordType
  date: string
  title: string
  description: string
  technologies: string[]
  hours?: number
  proficiency?: number
  status?: ProjectStatus
  resources?: string[]
  notes: string
}
