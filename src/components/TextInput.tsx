import React from 'react'
import {
  FormControl,
  FormLabel,
  Input,
  InputProps,
  Text
} from '@chakra-ui/react'

interface TextInputProps extends InputProps {
  label?: string
  type?: React.HTMLInputTypeAttribute
  errorMsg?: string
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, type, errorMsg, ...rest }, ref) => {
    return (
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <Input
          ref={ref}
          type={type ?? 'text'}
          variant='filled'
          bgColor='#C9C9C95d'
          {...rest}
        />

        {errorMsg && (
          <Text as='small' variant='textError'>
            {errorMsg}
          </Text>
        )}
      </FormControl>
    )
  }
)
