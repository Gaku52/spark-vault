import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface UpdatePasswordProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function UpdatePassword({ onSuccess, onCancel }: UpdatePasswordProps) {
  const [loading, setLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setMessage('新しいパスワードが一致しません')
      return
    }

    if (newPassword.length < 6) {
      setMessage('パスワードは6文字以上である必要があります')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      setMessage('パスワードを変更しました')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 1500)
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">パスワード変更</h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            キャンセル
          </button>
        )}
      </div>

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
  )
}
