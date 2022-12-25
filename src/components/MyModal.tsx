import {
  Modal,
  ModalProps,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button
} from '@chakra-ui/react'

interface MyModalProps {
  title: string
  isOpen: boolean
  onClose: () => void
  formID: string
  btnLoading: boolean
  btnText?: string
  btnVariant?: string
  size?: ModalProps['size']
}

export const MyModal: FCC<MyModalProps> = ({
  title,
  children,
  isOpen,
  onClose,
  formID,
  btnLoading,
  btnText,
  btnVariant,
  size
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size ?? { base: 'full', sm: 'xl' }}
      motionPreset='slideInBottom'
    >
      <ModalOverlay bgColor='blackAlpha.500' backdropFilter='blur(2px)' />
      <ModalContent bgColor='bgAlt'>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>

        <ModalFooter gap={3}>
          <Button variant='secondary' onClick={onClose} fontSize='.9rem'>
            Cerrar
          </Button>

          <Button
            type='submit'
            form={formID}
            variant={btnVariant ?? 'success'}
            fontSize='.9rem'
            isLoading={btnLoading}
            loadingText='Cargando...'
          >
            {btnText ?? 'Agregar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
