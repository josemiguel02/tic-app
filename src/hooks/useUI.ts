import { useContext } from 'react'
import UIContext from '@/context/ui/UIContext'

export const useUI = () => {
  const uiContext = useContext(UIContext)

  return {
    ...uiContext
  }
}
