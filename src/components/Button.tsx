import { MutableRefObject } from 'react'
import { Button as ChakraButton, ButtonProps, Icon } from '@chakra-ui/react'
import { MdOutlineArrowRightAlt } from 'react-icons/md'

interface MyButtonProps extends ButtonProps {
  text: string
  href?: string
  ref?: MutableRefObject<HTMLButtonElement | null>
}

export const Button: FCC<MyButtonProps> = ({ text, ...rest }) => {
  return (
    <ChakraButton
      fontSize='.9rem'
      rightIcon={<Icon as={MdOutlineArrowRightAlt} boxSize={5} />}
      {...rest}
    >
      {text}
    </ChakraButton>
  )
}
