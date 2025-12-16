import { useEffect, useState } from 'react'
import { Device } from '@capacitor/device'
import { Preferences } from '@capacitor/preferences'
import { Capacitor } from '@capacitor/core'

const DEVICE_ID_KEY = 'spark_vault_device_id'

/**
 * デバイスIDを管理するhook
 * - iOS: Capacitor DeviceのUUIDを使用
 * - Web: ランダムUUIDを生成してlocalStorageに保存
 */
export function useDeviceId() {
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getOrCreateDeviceId = async () => {
      try {
        // まず保存済みのデバイスIDを確認
        const { value: savedId } = await Preferences.get({ key: DEVICE_ID_KEY })

        if (savedId) {
          setDeviceId(savedId)
          setLoading(false)
          return
        }

        // 保存されていない場合は新規作成
        let newDeviceId: string

        if (Capacitor.isNativePlatform()) {
          // iOS: Capacitor DeviceのUUIDを取得
          const info = await Device.getId()
          newDeviceId = info.identifier
        } else {
          // Web: ランダムUUIDを生成
          newDeviceId = crypto.randomUUID()
        }

        // 新しいデバイスIDを保存
        await Preferences.set({
          key: DEVICE_ID_KEY,
          value: newDeviceId,
        })

        setDeviceId(newDeviceId)
      } catch (error) {
        console.error('Failed to get/create device ID:', error)
        // フォールバック: ランダムUUIDを生成（保存しない）
        setDeviceId(crypto.randomUUID())
      } finally {
        setLoading(false)
      }
    }

    getOrCreateDeviceId()
  }, [])

  return { deviceId, loading }
}
