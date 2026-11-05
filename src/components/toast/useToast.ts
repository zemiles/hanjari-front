import { useContext } from 'react'
import { ToastContext, type ToastApi } from './ToastContext'

export function useToast(): ToastApi {
  const toast = useContext(ToastContext)
  if (!toast) {
    throw new Error('useToast는 ToastProvider 안에서만 쓸 수 있다')
  }
  return toast
}
