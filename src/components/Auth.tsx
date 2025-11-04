import { useState } from 'react'
import { supabase } from '../lib/supabase'

type AuthMode = 'signin' | 'signup' | 'reset'

const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin

export function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [mode, setMode] = useState<AuthMode>('signin')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setMessage('')

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: APP_URL,
        },
      })

      if (error) throw error

      if (data.user) {
        setMessage('アカウントを作成しました。確認メールを送信しましたので、メールを確認してください。')
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setMessage('')

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setMessage('ログインに成功しました。')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setMessage('')

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${APP_URL}/reset-password`,
      })

      if (error) throw error

      setMessage('パスワードリセット用のリンクをメールで送信しました。')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = mode === 'reset' ? handleResetPassword : mode === 'signup' ? handleSignUp : handleSignIn

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Spark Vault</h1>
          <p className="text-muted-foreground">ひらめきを即座に記録</p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md space-y-4">
          {mode !== 'reset' && (
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                  mode === 'signin'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                ログイン
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                  mode === 'signup'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                新規登録
              </button>
            </div>
          )}

          {mode === 'reset' && (
            <div className="mb-4">
              <h2 className="text-xl font-bold text-center">パスワードリセット</h2>
              <p className="text-sm text-muted-foreground text-center mt-2">
                登録済みのメールアドレスを入力してください
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={loading}
              />
            </div>

            {mode !== 'reset' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  パスワード
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? '処理中...' : mode === 'reset' ? 'リセットリンクを送信' : mode === 'signup' ? 'アカウント作成' : 'ログイン'}
            </button>

            {mode === 'signin' && (
              <button
                type="button"
                onClick={() => setMode('reset')}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                パスワードを忘れた場合
              </button>
            )}

            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ログイン画面に戻る
              </button>
            )}

            {message && (
              <p className={`text-sm text-center ${message.includes('成功') || message.includes('作成') || message.includes('送信') ? 'text-green-600' : 'text-destructive'}`}>
                {message}
              </p>
            )}
          </form>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          {mode === 'signup'
            ? '確認メールが送信されます。メールのリンクをクリックしてアカウントを有効化してください。'
            : mode === 'reset'
            ? 'メールアドレスにパスワードリセット用のリンクが送信されます。'
            : 'アカウントをお持ちでない場合は新規登録してください。'}
        </p>
      </div>
    </div>
  )
}
