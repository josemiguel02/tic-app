import React from 'react'
import { Input, InputProps } from '@chakra-ui/react'

interface MyInputProps extends InputProps {
  error?: React.ReactElement
}

export const MyInput = React.forwardRef<HTMLInputElement, MyInputProps>(({ error, ...rest }, ref) => {
  return (
    <>
      <Input
        ref={ref}
        type='text'
        variant='filled'
        bgColor='#C9C9C95d'
        focusBorderColor='primary'
        {...rest}
      />

      {error}
    </>
  )
})
