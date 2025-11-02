import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setMessage('')

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      })

      if (error) throw error

      setMessage('ログインリンクをメールで送信しました。メールを確認してください。')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Spark Vault</h1>
          <p className="text-muted-foreground">ひらめきを即座に記録</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 bg-card p-6 rounded-lg shadow-md">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? '送信中...' : 'ログインリンクを送信'}
          </button>

          {message && (
            <p className={`text-sm text-center ${message.includes('送信') ? 'text-green-600' : 'text-destructive'}`}>
              {message}
            </p>
          )}
        </form>

        <p className="text-xs text-center text-muted-foreground">
          パスワード不要のマジックリンク認証を使用しています
        </p>
      </div>
    </div>
  )
}
