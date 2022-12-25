import { createContext } from 'react'

interface UIContextProps {
  isOpenFinishDialog: boolean
  onOpenFinishDialog: () => void
}

const UIContext = createContext({} as UIContextProps)

export default UIContext
