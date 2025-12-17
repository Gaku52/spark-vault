import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { usePasswordValidation } from '../hooks/usePasswordValidation'

export function ResetPassword() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const {
    password: newPassword,
    setPassword: setNewPassword,
    confirmPassword,
    setConfirmPassword,
    validatePassword,
    validateConfirmPassword,
    getPasswordStrengthColor,
    getPasswordStrengthLabel
  } = usePasswordValidation()

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

    // パスワード検証
    const validation = validatePassword(newPassword)
    if (!validation.isValid) {
      setMessage(validation.errors[0])
      return
    }

    // 確認パスワード検証
    const confirmError = validateConfirmPassword(newPassword, confirmPassword)
    if (confirmError) {
      setMessage(confirmError)
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

  const passwordValidation = validatePassword(newPassword)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4 ios-safe-area-top ios-safe-area-bottom">
      <div className="w-full max-w-md space-y-8 animate-fadeIn">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg shadow-primary/30 mb-4 animate-scaleIn">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Spark Vault
          </h1>
          <p className="text-base text-muted-foreground">新しいパスワードを設定</p>
        </div>

        <div className="bg-card/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-border/50 space-y-5 animate-slideIn">
          <div className="flex items-center gap-3 justify-center">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">新しいパスワード</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-semibold text-foreground">
                新しいパスワード
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="12文字以上、大小英数字・特殊文字を含む"
                className="w-full px-4 py-3 border border-border rounded-xl bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all-smooth placeholder:text-muted-foreground/50"
                required
                disabled={loading}
                minLength={12}
              />
              {newPassword && (
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">強度:</span>
                    <span className={`font-semibold ${getPasswordStrengthColor(passwordValidation.strength)}`}>
                      {getPasswordStrengthLabel(passwordValidation.strength)}
                    </span>
                  </div>
                  {passwordValidation.errors.length > 0 && (
                    <ul className="text-red-600 space-y-0.5">
                      {passwordValidation.errors.map((error, idx) => (
                        <li key={idx}>• {error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground">
                新しいパスワード（確認）
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="上記と同じパスワードを入力"
                className="w-full px-4 py-3 border border-border rounded-xl bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all-smooth placeholder:text-muted-foreground/50"
                required
                disabled={loading}
                minLength={12}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all-smooth transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  変更中...
                </span>
              ) : (
                'パスワードを変更'
              )}
            </button>

            {message && (
              <div className={`p-4 rounded-xl text-sm text-center animate-fadeIn ${
                message.includes('変更しました')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
