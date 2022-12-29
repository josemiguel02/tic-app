import { useRef } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react'

interface DialogProps {
  title: string
  description?: string
  btnText: string
  btnVariant?: string
  showBtnCancel?: boolean
  isOpen: boolean
  onClose?: () => void
  onAction?: () => void
  btnLoading?: boolean
  error?: React.ReactElement
}

export const Dialog: FCC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  btnText,
  btnVariant,
  showBtnCancel = true,
  onAction,
  btnLoading,
  children,
  error
}) => {
  const cancelRef = useRef(null)

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose!}
      motionPreset='slideInBottom'
      closeOnOverlayClick={showBtnCancel}
    >
      <AlertDialogOverlay bgColor='blackAlpha.500' backdropFilter='blur(2px)'>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>
            {error}
            {description ?? children}
          </AlertDialogBody>

          <AlertDialogFooter gap={3}>
            {showBtnCancel && (
              <Button variant='ghost' ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
            )}
            <Button
              variant={btnVariant}
              onClick={onAction}
              isLoading={btnLoading}
              loadingText='Cargando...'
            >
              {btnText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
