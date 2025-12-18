#!/usr/bin/env tsx
/**
 * Supabaseのテーブル構造を確認するスクリプト
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://cnldsirgrtbouoegkscz.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '***REMOVED***'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkTables() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Supabase テーブル構造確認')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`プロジェクトURL: ${supabaseUrl}`)
  console.log('')

  // 1. notesテーブルを確認
  console.log('【1】notesテーブルの確認')
  const { data: notesData, error: notesError } = await supabase
    .from('notes')
    .select('*')
    .limit(1)

  if (notesError) {
    console.log('❌ notesテーブル: エラー')
    console.log('   エラーコード:', notesError.code)
    console.log('   メッセージ:', notesError.message)
    console.log('   詳細:', notesError.details)
    console.log('')
  } else {
    console.log('✅ notesテーブル: 存在する')
    console.log('   データ件数:', notesData?.length || 0)
    console.log('')
  }

  // 2. 他の一般的なテーブル名を確認
  const tableNames = ['memo', 'ideas', 'records', 'note', 'memos', 'idea']

  console.log('【2】他のテーブル名を確認')
  for (const tableName of tableNames) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1)

    if (!error) {
      console.log(`✅ ${tableName}テーブル: 存在する`)
      console.log(`   データ件数: ${data?.length || 0}`)
    }
  }
  console.log('')

  // 3. 認証状態を確認
  console.log('【3】認証状態の確認')
  const { data: sessionData } = await supabase.auth.getSession()
  console.log('   セッション:', sessionData.session ? '有効' : '無効')
  console.log('')

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

checkTables().catch(console.error)
