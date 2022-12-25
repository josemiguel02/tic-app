import { useDisclosure } from '@chakra-ui/react'
import UIContext from './UIContext'

export interface UIState {
  isOpenFinishDialog: boolean
}

const UIProvider: FCC = ({ children }) => {
  const { isOpen: isOpenFinishDialog, onOpen: onOpenFinishDialog } = useDisclosure()

  return (
    <UIContext.Provider
      value={{
        isOpenFinishDialog,
        onOpenFinishDialog
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export default UIProvider
