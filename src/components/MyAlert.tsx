import { Flex, Icon, IconButton, chakra } from '@chakra-ui/react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { BiErrorCircle } from 'react-icons/bi'
import { IoMdClose } from 'react-icons/io'

const variants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  enter: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeInOut' }
  },
  exit: {
    opacity: 0,
    scale: 0,
    transition: { duration: 0.3, ease: 'easeInOut' }
  }
}

interface MyAlertProps {
  show: boolean
  onClose: () => void
  title?: string
  description: string
}

export const MyAlert: FCC<MyAlertProps> = ({
  show,
  onClose,
  title = 'Error',
  description
}) => {
  return (
    <AnimatePresence>
      {show ? (
        <Flex
          as={motion.div}
          w='full'
          bg='red.500'
          color='white'
          shadow='sm'
          rounded='lg'
          overflow='hidden'
          variants={variants}
          exit='exit'
          initial='hidden'
          animate='enter'
          mb={5}
          pos='relative'
        >
          <Flex justifyContent='center' alignItems='center' w={12}>
            <Icon as={BiErrorCircle} boxSize={6} />
          </Flex>

          <Flex py={2} flexDir='column' w='full'>
            <chakra.span fontWeight='bold'>{title}</chakra.span>
            <chakra.p fontSize='sm'>{description}</chakra.p>
          </Flex>

          <IconButton
            variant='ghost'
            size='sm'
            aria-label='Close alert'
            icon={<Icon as={IoMdClose} boxSize={4} />}
            onClick={onClose}
            _hover={{
              bgColor: 'whiteAlpha.200'
            }}
            _active={{
              bgColor: 'whiteAlpha.400'
            }}
          />
        </Flex>
      ) : null}
    </AnimatePresence>
  )
}
