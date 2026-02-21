import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useDeviceId } from './useDeviceId'

/**
 * ゲスト認証を管理するhook
 */
export function useGuestAuth() {
  const { deviceId } = useDeviceId()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * ゲストとして自動ログイン
   */
  const signInAsGuest = async () => {
    if (!deviceId) {
      setError('デバイスIDの取得に失敗しました')
      return { success: false }
    }

    try {
      setLoading(true)
      setError(null)

      // Supabase匿名認証
      const { data, error: signInError } = await supabase.auth.signInAnonymously({
        options: {
          data: {
            device_id: deviceId,
            is_guest: true,
          },
        },
      })

      if (signInError) throw signInError

      return { success: true, user: data.user }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ゲストログインに失敗しました'
      setError(errorMessage)
      console.error('Guest sign in error:', err)
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  /**
   * ゲストアカウントを本アカウントに変換
   */
  const convertGuestToUser = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      // 現在のゲストセッションを取得
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('セッションが見つかりません')
      }

      // ゲストユーザーのメタデータを確認
      const isGuest = session.user.user_metadata?.is_guest
      if (!isGuest) {
        throw new Error('ゲストユーザーではありません')
      }

      // ユーザーのメールとパスワードを更新
      const { error: updateError } = await supabase.auth.updateUser({
        email,
        password,
        data: {
          is_guest: false,
          device_id: session.user.user_metadata?.device_id,
        },
      })

      if (updateError) throw updateError

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'アカウント変換に失敗しました'
      setError(errorMessage)
      console.error('Convert guest to user error:', err)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    signInAsGuest,
    convertGuestToUser,
    loading,
    error,
  }
}
