import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Keyboard } from '@capacitor/keyboard'
import { Capacitor } from '@capacitor/core'
import { useDeviceId } from '../hooks/useDeviceId'

type AuthMode = 'signin' | 'signup' | 'reset'

const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin

interface AuthProps {
  initialMode?: AuthMode
  onSuccess?: () => void
}

export function Auth({ initialMode = 'signin', onSuccess }: AuthProps = {}) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const { deviceId } = useDeviceId()

  // iOSキーボード対応: キーボードの高さを監視
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const showListener = Keyboard.addListener('keyboardWillShow', (info) => {
      setKeyboardHeight(info.keyboardHeight)
    })

    const hideListener = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0)
    })

    return () => {
      showListener.remove()
      hideListener.remove()
    }
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setMessage('')

      // 現在のゲストセッションを取得
      const { data: { session: guestSession } } = await supabase.auth.getSession()
      const isGuest = guestSession?.user?.is_anonymous || false
      const oldUserId = guestSession?.user?.id

      // 新しいアカウントを作成
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: APP_URL,
          data: {
            device_id: deviceId,
          }
        },
      })

      if (error) throw error

      if (data.user) {
        // ゲストユーザーだった場合、データを新しいアカウントに移行
        if (isGuest && oldUserId) {
          const newUserId = data.user.id

          // ideasテーブルのuser_idを更新（ゲストのデータを新しいアカウントに移行）
          const { error: updateError } = await supabase
            .from('ideas')
            .update({ user_id: newUserId })
            .eq('user_id', oldUserId)

          if (updateError) {
            console.error('データ移行エラー:', updateError)
            setMessage('アカウントを作成しましたが、データの移行に失敗しました。確認メールを送信しましたので、メールを確認してください。')
            // エラーの場合は自動で閉じない
            return
          }
        }

        setMessage('アカウントを作成しました。確認メールを送信しましたので、メールを確認してください。')

        // アカウント作成成功後、メッセージを読む時間を与えてからモーダルを閉じる
        setTimeout(() => {
          onSuccess?.()
        }, 2000)
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

      // ログイン成功後、少し待ってからモーダルを閉じる
      setTimeout(() => {
        onSuccess?.()
      }, 500)
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

  // キーボード表示時のフォーム位置調整
  const formTransform = keyboardHeight > 0
    ? `translateY(-${Math.min(keyboardHeight * 0.4, 180)}px)`
    : 'translateY(0)'

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div
        className="w-full max-w-md space-y-8 animate-fadeIn transition-all duration-300 ease-out"
        style={{ transform: formTransform }}
      >
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg shadow-primary/30 mb-4 animate-scaleIn">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Spark Vault
          </h1>
          <p className="text-base text-muted-foreground">ひらめきを即座に記録し、未来を創造する</p>
        </div>

        <div className="bg-card/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-border/50 space-y-5 animate-slideIn">
          {mode !== 'reset' && (
            <div className="flex gap-2 mb-6 p-1 bg-muted/30 rounded-xl">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all-smooth ${
                  mode === 'signin'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                ログイン
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all-smooth ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                新規登録
              </button>
            </div>
          )}

          {mode === 'reset' && (
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold">パスワードリセット</h2>
              <p className="text-sm text-muted-foreground mt-2">
                登録済みのメールアドレスを入力してください
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-border rounded-xl bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all-smooth placeholder:text-muted-foreground/50"
                required
                disabled={loading}
              />
            </div>

            {mode !== 'reset' && (
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                  パスワード
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all-smooth placeholder:text-muted-foreground/50"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            )}

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
                  処理中...
                </span>
              ) : (
                mode === 'reset' ? 'リセットリンクを送信' : mode === 'signup' ? 'アカウント作成' : 'ログイン'
              )}
            </button>

            {mode === 'signin' && (
              <button
                type="button"
                onClick={() => setMode('reset')}
                className="w-full text-sm text-muted-foreground hover:text-primary transition-all-smooth"
              >
                パスワードを忘れた場合
              </button>
            )}

            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="w-full text-sm text-muted-foreground hover:text-primary transition-all-smooth"
              >
                ← ログイン画面に戻る
              </button>
            )}

            {message && (
              <div className={`p-4 rounded-xl text-sm text-center animate-fadeIn ${
                message.includes('成功') || message.includes('作成') || message.includes('送信')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}
          </form>
        </div>

        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground px-4">
            {mode === 'signup'
              ? '確認メールが送信されます。メールのリンクをクリックしてアカウントを有効化してください。'
              : mode === 'reset'
              ? 'メールアドレスにパスワードリセット用のリンクが送信されます。'
              : 'アカウントをお持ちでない場合は新規登録してください。'}
          </p>
        </div>
      </div>
    </div>
  )
}
