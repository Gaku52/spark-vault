import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export function ResetPassword() {
  const [loading, setLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user came from password reset email
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User is in password recovery mode
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setMessage('パスワードが一致しません')
      return
    }

    if (newPassword.length < 6) {
      setMessage('パスワードは6文字以上である必要があります')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      setMessage('パスワードを変更しました。ログイン画面に移動します...')

      setTimeout(() => {
        navigate('/')
      }, 2000)
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
          <p className="text-muted-foreground">新しいパスワードを設定</p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-bold text-center">新しいパスワード</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                新しいパスワード
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                新しいパスワード（確認）
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? '変更中...' : 'パスワードを変更'}
            </button>

            {message && (
              <p className={`text-sm text-center ${message.includes('変更しました') ? 'text-green-600' : 'text-destructive'}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
