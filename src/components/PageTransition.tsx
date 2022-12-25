import { Flex, FlexProps } from '@chakra-ui/react'
import { motion, type Variants } from 'framer-motion'

const variants: Variants = {
  hidden: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeInOut' }
  },
  exit: { opacity: 0, y: 20 }
}

interface PageTransitionProps extends FlexProps {}

export const PageTransition: FCC<PageTransitionProps> = ({ children, ...rest }) => {
  return (
    <Flex
      as={motion.div}
      exit='exit'
      initial='hidden'
      animate='enter'
      variants={variants}
      justify='center'
      {...rest}
    >
      {children}
    </Flex>
  )
}
