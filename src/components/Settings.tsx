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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
              <p>バージョン: 1.1.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
