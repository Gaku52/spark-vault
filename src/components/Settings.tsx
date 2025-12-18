import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'

interface SettingsProps {
  onShowAuth: () => void
  onClose: () => void
}

export function Settings({ onShowAuth, onClose }: SettingsProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [showAccountSection, setShowAccountSection] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  const isGuest = session?.user?.is_anonymous || session?.user?.user_metadata?.is_guest

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload() // ゲストモードで再起動
  }

  const handleDeleteAccount = async () => {
    if (!session?.user?.id) return

    setIsDeleting(true)

    try {
      // ユーザーのすべてのメモを削除
      const { error: notesError } = await supabase
        .from('notes')
        .delete()
        .eq('user_id', session.user.id)

      if (notesError) {
        console.error('メモの削除エラー:', notesError)
        alert('データの削除中にエラーが発生しました。もう一度お試しください。')
        return
      }

      // 成功メッセージを表示
      alert('すべてのデータが削除されました。アカウントからログアウトします。')

      // ログアウト（セッションをクリア）
      await supabase.auth.signOut()

      // ページをリロード
      window.location.reload()
    } catch (error) {
      console.error('アカウント削除エラー:', error)
      alert('アカウントの削除中にエラーが発生しました。もう一度お試しください。')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ios-safe-area-top ios-safe-area-bottom">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">設定</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* アカウント情報セクション */}
          <div className="space-y-2">
            <button
              onClick={() => setShowAccountSection(!showAccountSection)}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              {showAccountSection ? 'アカウント情報を非表示' : 'アカウント情報を表示'}
            </button>

            {showAccountSection && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="text-sm text-gray-600">
                  {isGuest ? (
                    <>
                      <p className="font-semibold mb-2">ゲストモード</p>
                      <p className="text-xs mb-4">
                        現在ゲストモードで使用中です。ログイン / 登録すると、データをバックアップして複数端末で同期できます。
                      </p>
                      <button
                        onClick={() => {
                          onClose()
                          onShowAuth()
                        }}
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        ログイン / 登録
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold mb-2">ログイン済み</p>
                      <p className="text-xs mb-1">
                        メール: {session?.user?.email || '未設定'}
                      </p>
                      <button
                        onClick={handleSignOut}
                        className="mt-4 w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        ログアウト
                      </button>

                      {/* データ削除ボタン */}
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="mt-2 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        データを削除
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* その他の設定項目 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">アプリ情報</h3>
            <div className="text-xs text-gray-600">
              <p>バージョン: 1.4.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* データ削除確認ダイアログ */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              すべてのデータを削除しますか？
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              この操作は取り消せません。すべてのメモとデータが完全に削除され、ログアウトされます。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
