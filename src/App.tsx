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
import { useGuestAuth } from './hooks/useGuestAuth'
import { useDeviceId } from './hooks/useDeviceId'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { signInAsGuest } = useGuestAuth()
  const { deviceId, loading: deviceIdLoading } = useDeviceId()

  // Capacitorネイティブ機能の初期化
  useEffect(() => {
    const initializeCapacitor = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark })
        await StatusBar.setBackgroundColor({ color: '#8b5cf6' })
        await SplashScreen.hide()
        Keyboard.setAccessoryBarVisible({ isVisible: true })
      } catch (error) {
        console.log('Capacitor plugins not available (running on web)', error)
      }
    }

    initializeCapacitor()

    CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active:', isActive)
    })
  }, [])

  // 認証状態の初期化と監視
  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        setSession(session)
      } else if (!deviceIdLoading && deviceId) {
        // セッションがない場合、自動的にゲストログイン
        await signInAsGuest()
      }

      setLoading(false)
    }

    initializeAuth()

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [deviceId, deviceIdLoading])

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
          element={<IdeaList />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
