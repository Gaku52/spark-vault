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

### 実装方法別アイデア取得
```typescript
async function getIdeasByActionType(actionType: ActionType) {
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('action_type', actionType)
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

### タグでフィルター
```typescript
async function getIdeasByTag(tag: string) {
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .contains('tags', [tag])
    .order('created_at', { ascending: false })

  return { data, error }
}
```

---

## 統計・分析 API

### アイデア統計取得
```typescript
async function getIdeaStats() {
  const user = await getCurrentUser()

  // 全体の件数
  const { count: totalCount } = await supabase
    .from('ideas')
    .select('*', { count: 'exact', head: true })

  // 実装方法別の件数
  const [buildApp, useExisting, pending] = await Promise.all([
    supabase.from('ideas').select('*', { count: 'exact', head: true }).eq('action_type', 'build_app'),
    supabase.from('ideas').select('*', { count: 'exact', head: true }).eq('action_type', 'use_existing'),
    supabase.from('ideas').select('*', { count: 'exact', head: true }).eq('action_type', 'pending')
  ])

  return {
    total: totalCount || 0,
    buildApp: buildApp.count || 0,
    useExisting: useExisting.count || 0,
    pending: pending.count || 0
  }
}
```

### 最近のアイデア取得
```typescript
async function getRecentIdeas(limit: number = 5) {
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  return { data, error }
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

`ideas` テーブルで以下のRLSポリシーが適用されます：

1. **SELECT**: ユーザーは自分のアイデアのみ閲覧可能
2. **INSERT**: ユーザーは自分のアイデアのみ挿入可能
3. **UPDATE**: ユーザーは自分のアイデアのみ更新可能
4. **DELETE**: ユーザーは自分のアイデアのみ削除可能

これにより、ユーザー間のデータ分離が自動的に保証されます。

---

## パフォーマンス最適化

### キャッシュ戦略
React Queryなどのライブラリでクライアント側データをキャッシュ：

```typescript
import { useQuery, useMutation } from '@tanstack/react-query'

// アイデア一覧取得（キャッシュ付き）
const { data: ideas } = useQuery({
  queryKey: ['ideas'],
  queryFn: getIdeas
})

// アイデア作成（キャッシュ無効化）
const createMutation = useMutation({
  mutationFn: createIdea,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['ideas'] })
  }
})
```

### 楽観的UI更新
```typescript
const deleteMutation = useMutation({
  mutationFn: deleteIdea,
  onMutate: async (id) => {
    // UIを即座に更新
    await queryClient.cancelQueries({ queryKey: ['ideas'] })
    const previousIdeas = queryClient.getQueryData(['ideas'])

    queryClient.setQueryData(['ideas'], (old: Idea[]) =>
      old.filter(idea => idea.id !== id)
    )

    return { previousIdeas }
  },
  onError: (err, id, context) => {
    // エラー時はロールバック
    queryClient.setQueryData(['ideas'], context.previousIdeas)
  }
})
```

---

## 実装例：カスタムフック

```typescript
// src/hooks/useIdeas.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getIdeas, createIdea, updateIdea, deleteIdea } from '@/services/ideaService'

export function useIdeas() {
  const queryClient = useQueryClient()

  const { data: ideas, isLoading, error } = useQuery({
    queryKey: ['ideas'],
    queryFn: getIdeas
  })

  const createMutation = useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<IdeaInput> }) =>
      updateIdea(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
    }
  })

  return {
    ideas: ideas?.data || [],
    isLoading,
    error,
    createIdea: createMutation.mutate,
    updateIdea: updateMutation.mutate,
    deleteIdea: deleteMutation.mutate
  }
}
```

---

このシンプルなAPI設計で、高速で保守しやすいアプリケーションを構築できます。
