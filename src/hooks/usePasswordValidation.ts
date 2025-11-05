import { useState } from 'react'

interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong'
}

export function usePasswordValidation() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const validatePassword = (pwd: string): PasswordValidationResult => {
    const errors: string[] = []
    let strength: 'weak' | 'medium' | 'strong' = 'weak'

    // 長さチェック
    if (pwd.length < 12) {
      errors.push('パスワードは12文字以上である必要があります')
    }

    // 大文字チェック
    if (!/[A-Z]/.test(pwd)) {
      errors.push('大文字を1文字以上含めてください')
    }

    // 小文字チェック
    if (!/[a-z]/.test(pwd)) {
      errors.push('小文字を1文字以上含めてください')
    }

    // 数字チェック
    if (!/\d/.test(pwd)) {
      errors.push('数字を1文字以上含めてください')
    }

    // 特殊文字チェック
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) {
      errors.push('特殊文字を1文字以上含めてください (!@#$%^&* など)')
    }

    // 強度判定
    if (errors.length === 0) {
      strength = 'strong'
    } else if (errors.length <= 2) {
      strength = 'medium'
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength
    }
  }

  const validateConfirmPassword = (pwd: string, confirm: string): string | null => {
    if (pwd !== confirm) {
      return 'パスワードが一致しません'
    }
    return null
  }

  const getPasswordStrengthColor = (strength: 'weak' | 'medium' | 'strong'): string => {
    switch (strength) {
      case 'weak':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'strong':
        return 'text-green-600'
    }
  }

  const getPasswordStrengthLabel = (strength: 'weak' | 'medium' | 'strong'): string => {
    switch (strength) {
      case 'weak':
        return '弱い'
      case 'medium':
        return '中程度'
      case 'strong':
        return '強い'
    }
  }

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    validatePassword,
    validateConfirmPassword,
    getPasswordStrengthColor,
    getPasswordStrengthLabel
  }
}
