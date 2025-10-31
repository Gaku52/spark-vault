# Spark Vault - API設計ドキュメント

このドキュメントでは、Supabaseを使用したデータベース操作のAPI設計を定義します。

---

## 認証 API

### ユーザー登録
```typescript
async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })
  return { data, error }
}
```

### ログイン
```typescript
async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}
```

### ログアウト
```typescript
async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}
```

### 現在のユーザー取得
```typescript
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
```

---

## アイデアメモ API

### アイデア一覧取得
```typescript
// すべてのアイデアを取得（最新順）
async function getIdeas() {
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}
```

### カテゴリ別アイデア取得
```typescript
async function getIdeasByCategory(category: string) {
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  return { data, error }
}
```

### アイデア作成
```typescript
async function createIdea(idea: IdeaInput) {
  const { data, error } = await supabase
    .from('ideas')
    .insert([{
      ...idea,
      user_id: (await getCurrentUser())?.id
    }])
    .select()
    .single()

  return { data, error }
}
```

### アイデア更新
```typescript
async function updateIdea(id: string, updates: Partial<IdeaInput>) {
  const { data, error } = await supabase
    .from('ideas')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}
```

### アイデア削除
```typescript
async function deleteIdea(id: string) {
  const { error } = await supabase
    .from('ideas')
    .delete()
    .eq('id', id)

  return { error }
}
```

### 検索
```typescript
async function searchIdeas(query: string) {
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  return { data, error }
}
```

---

## DJ成長記録 API

### DJ記録一覧取得
```typescript
async function getDJRecords() {
  const { data, error } = await supabase
    .from('dj_records')
    .select('*')
    .order('date', { ascending: false })

  return { data, error }
}
```

### タイプ別DJ記録取得
```typescript
async function getDJRecordsByType(type: 'skill' | 'mix' | 'performance') {
  const { data, error } = await supabase
    .from('dj_records')
    .select('*')
    .eq('type', type)
    .order('date', { ascending: false })

  return { data, error }
}
```

### DJ記録作成
```typescript
async function createDJRecord(record: DJRecordInput) {
  const { data, error } = await supabase
    .from('dj_records')
    .insert([{
      ...record,
      user_id: (await getCurrentUser())?.id
    }])
    .select()
    .single()

  return { data, error }
}
```

### DJ記録更新
```typescript
async function updateDJRecord(id: string, updates: Partial<DJRecordInput>) {
  const { data, error } = await supabase
    .from('dj_records')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}
```

### DJ記録削除
```typescript
async function deleteDJRecord(id: string) {
  const { error } = await supabase
    .from('dj_records')
    .delete()
    .eq('id', id)

  return { error }
}
```

---

## エンジニア自己管理 API

### エンジニア記録一覧取得
```typescript
async function getEngineerRecords() {
  const { data, error } = await supabase
    .from('engineer_records')
    .select('*')
    .order('date', { ascending: false })

  return { data, error }
}
```

### ステータス別プロジェクト取得
```typescript
async function getProjectsByStatus(status: ProjectStatus) {
  const { data, error } = await supabase
    .from('engineer_records')
    .select('*')
    .eq('type', 'project')
    .eq('status', status)
    .order('date', { ascending: false })

  return { data, error }
}
```

### エンジニア記録作成
```typescript
async function createEngineerRecord(record: EngineerRecordInput) {
  const { data, error } = await supabase
    .from('engineer_records')
    .insert([{
      ...record,
      user_id: (await getCurrentUser())?.id
    }])
    .select()
    .single()

  return { data, error }
}
```

### エンジニア記録更新
```typescript
async function updateEngineerRecord(id: string, updates: Partial<EngineerRecordInput>) {
  const { data, error } = await supabase
    .from('engineer_records')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}
```

### エンジニア記録削除
```typescript
async function deleteEngineerRecord(id: string) {
  const { error } = await supabase
    .from('engineer_records')
    .delete()
    .eq('id', id)

  return { error }
}
```

---

## 健康管理 API

### 健康記録一覧取得
```typescript
async function getHealthRecords() {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .order('date', { ascending: false })

  return { data, error }
}
```

### 期間別健康記録取得
```typescript
async function getHealthRecordsByDateRange(startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })

  return { data, error }
}
```

### 健康記録作成
```typescript
async function createHealthRecord(record: HealthRecordInput) {
  const { data, error } = await supabase
    .from('health_records')
    .insert([{
      ...record,
      user_id: (await getCurrentUser())?.id
    }])
    .select()
    .single()

  return { data, error }
}
```

### 健康記録更新
```typescript
async function updateHealthRecord(id: string, updates: Partial<HealthRecordInput>) {
  const { data, error } = await supabase
    .from('health_records')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}
```

### 健康記録削除
```typescript
async function deleteHealthRecord(id: string) {
  const { error } = await supabase
    .from('health_records')
    .delete()
    .eq('id', id)

  return { error }
}
```

---

## 思考法記録 API

### 思考記録一覧取得
```typescript
async function getThinkingRecords() {
  const { data, error } = await supabase
    .from('thinking_records')
    .select('*')
    .order('date', { ascending: false })

  return { data, error }
}
```

### IQトラッキング記録取得
```typescript
async function getIQTrackingRecords() {
  const { data, error } = await supabase
    .from('thinking_records')
    .select('*')
    .eq('type', 'iq_tracking')
    .not('iq_level', 'is', null)
    .order('date', { ascending: true })

  return { data, error }
}
```

### 思考記録作成
```typescript
async function createThinkingRecord(record: ThinkingRecordInput) {
  const { data, error } = await supabase
    .from('thinking_records')
    .insert([{
      ...record,
      user_id: (await getCurrentUser())?.id
    }])
    .select()
    .single()

  return { data, error }
}
```

### 思考記録更新
```typescript
async function updateThinkingRecord(id: string, updates: Partial<ThinkingRecordInput>) {
  const { data, error } = await supabase
    .from('thinking_records')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}
```

### 思考記録削除
```typescript
async function deleteThinkingRecord(id: string) {
  const { error } = await supabase
    .from('thinking_records')
    .delete()
    .eq('id', id)

  return { error }
}
```

---

## 統計・分析 API

### ダッシュボードサマリー取得
```typescript
async function getDashboardSummary() {
  const user = await getCurrentUser()

  // 各テーブルの件数を並列取得
  const [ideas, djRecords, engineerRecords, healthRecords, thinkingRecords] = await Promise.all([
    supabase.from('ideas').select('id', { count: 'exact', head: true }),
    supabase.from('dj_records').select('id', { count: 'exact', head: true }),
    supabase.from('engineer_records').select('id', { count: 'exact', head: true }),
    supabase.from('health_records').select('id', { count: 'exact', head: true }),
    supabase.from('thinking_records').select('id', { count: 'exact', head: true })
  ])

  return {
    ideasCount: ideas.count || 0,
    djRecordsCount: djRecords.count || 0,
    engineerRecordsCount: engineerRecords.count || 0,
    healthRecordsCount: healthRecords.count || 0,
    thinkingRecordsCount: thinkingRecords.count || 0
  }
}
```

### 最近のアクティビティ取得（全機能）
```typescript
async function getRecentActivity(limit: number = 10) {
  // 各テーブルから最新の記録を取得
  const [ideas, djRecords, engineerRecords, healthRecords, thinkingRecords] = await Promise.all([
    supabase.from('ideas').select('id, title, created_at').order('created_at', { ascending: false }).limit(limit),
    supabase.from('dj_records').select('id, title, date, created_at').order('created_at', { ascending: false }).limit(limit),
    supabase.from('engineer_records').select('id, title, date, created_at').order('created_at', { ascending: false }).limit(limit),
    supabase.from('health_records').select('id, type, date, created_at').order('created_at', { ascending: false }).limit(limit),
    supabase.from('thinking_records').select('id, title, date, created_at').order('created_at', { ascending: false }).limit(limit)
  ])

  // すべての記録を統合してソート
  const allRecords = [
    ...(ideas.data || []).map(r => ({ ...r, source: 'idea' })),
    ...(djRecords.data || []).map(r => ({ ...r, source: 'dj' })),
    ...(engineerRecords.data || []).map(r => ({ ...r, source: 'engineer' })),
    ...(healthRecords.data || []).map(r => ({ ...r, source: 'health' })),
    ...(thinkingRecords.data || []).map(r => ({ ...r, source: 'thinking' }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return allRecords.slice(0, limit)
}
```

---

## エラーハンドリング

すべてのAPI関数は以下の形式でエラーを返します：

```typescript
interface APIResponse<T> {
  data: T | null
  error: PostgrestError | null
}
```

### 使用例
```typescript
const { data, error } = await getIdeas()

if (error) {
  console.error('Error fetching ideas:', error.message)
  // ユーザーにエラーメッセージを表示
  return
}

// dataを使用
console.log('Ideas:', data)
```

---

## Row Level Security (RLS) ポリシー

すべてのテーブルで以下のRLSポリシーが適用されます：

1. **SELECT**: ユーザーは自分のデータのみ閲覧可能
2. **INSERT**: ユーザーは自分のデータのみ挿入可能
3. **UPDATE**: ユーザーは自分のデータのみ更新可能
4. **DELETE**: ユーザーは自分のデータのみ削除可能

これにより、ユーザー間のデータ分離が自動的に保証されます。

---

## パフォーマンス最適化

### キャッシュ戦略
- React Queryなどのライブラリを使用してクライアント側でデータをキャッシュ
- 頻繁にアクセスするデータは定期的に再検証

### バッチ操作
複数のデータを一度に取得する場合は、Promise.allを使用して並列実行：

```typescript
const [ideas, djRecords] = await Promise.all([
  getIdeas(),
  getDJRecords()
])
```

### ページネーション
大量のデータを扱う場合は、ページネーションを実装：

```typescript
async function getIdeasPaginated(page: number = 0, pageSize: number = 20) {
  const from = page * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('ideas')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false })

  return { data, error, count }
}
```

---

このAPI設計に従って実装することで、一貫性のある保守しやすいコードベースを構築できます。
