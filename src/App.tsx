import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { Auth } from './components/Auth'
import { IdeaList } from './components/IdeaList'
import { ResetPassword } from './components/ResetPassword'
import type { Session } from '@supabase/supabase-js'
import { App as CapacitorApp } from '@capacitor/app'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import { Keyboard } from '@capacitor/keyboard'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Capacitorネイティブ機能の初期化
    const initializeCapacitor = async () => {
      try {
        // ステータスバーの設定
        await StatusBar.setStyle({ style: Style.Dark })
        await StatusBar.setBackgroundColor({ color: '#8b5cf6' })

        // スプラッシュスクリーンを非表示
        await SplashScreen.hide()

        // キーボードの設定
        Keyboard.setAccessoryBarVisible({ isVisible: true })
      } catch (error) {
        // Web環境ではエラーになるが無視
        console.log('Capacitor plugins not available (running on web)', error)
      }
    }

    initializeCapacitor()

    // アプリのステート変更を監視（バックグラウンド/フォアグラウンド）
    CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active:', isActive)
    })

    // セッション取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">読み込み中...</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/"
          element={session ? <IdeaList /> : <Auth />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
