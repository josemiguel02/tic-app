/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Input, InputProps } from '@chakra-ui/react'
import { Column, Table } from '@tanstack/react-table'

interface FilterInputProps {
  column: Column<any, any>
  table: Table<any>
}

export const FilterInput: FCC<FilterInputProps> = ({ column, table }) => {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  return typeof firstValue === 'number' ? (
    <>
      <DebouncedInput
        mr={2}
        type='number'
        size='xs'
        maxW={14}
        variant='flushed'
        placeholder='Min'
        focusBorderColor='primary'
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={value =>
          column.setFilterValue((old: [number, number]) => [value, old?.[1]])
        }
        _placeholder={{ color: 'gray.400' }}
      />
      <DebouncedInput
        type='number'
        size='xs'
        maxW={14}
        variant='flushed'
        placeholder='Max'
        focusBorderColor='primary'
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={value =>
          column.setFilterValue((old: [number, number]) => [old?.[0], value])
        }
        _placeholder={{ color: 'gray.400' }}
      />
    </>
  ) : (
    <DebouncedInput
      type='text'
      size='xs'
      variant='flushed'
      placeholder='Buscar...'
      focusBorderColor='primary'
      value={(columnFilterValue ?? '') as string}
      onChange={value => column.setFilterValue(value)}
      _placeholder={{ color: 'gray.400' }}
    />
  )
}

type DebouncedInputProps = {
  value: string | number
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<InputProps, 'onChange'>

const DebouncedInput: FCC<DebouncedInputProps> = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...rest
}) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <Input value={value} onChange={e => setValue(e.target.value)} {...rest} />
  )
}
