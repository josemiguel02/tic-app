import React from 'react'
import Countdown, { type CountdownRenderProps } from 'react-countdown'
import { BoxProps, Flex, Text, Icon } from '@chakra-ui/react'
import { FaRegClock } from 'react-icons/fa'
import { useUI } from '@/hooks'

const renderer = ({ minutes, seconds, completed }: CountdownRenderProps) => {
  if (completed) return <Text>Se ha terminado el tiempo</Text>

  return (
    <Flex gap={2} align='center'>
      <Text fontWeight='semibold' fontSize='1.2rem'>
        {minutes}m:{seconds}s
      </Text>
      <Icon as={FaRegClock} boxSize={5} />
    </Flex>
  )
}

interface CounterProps extends BoxProps {
  totalTime?: string | number | Date
  onComplete?: () => void
  start?: boolean
}

export const Timer: FCC<CounterProps> = React.memo(() => {
  const { onOpenFinishDialog } = useUI()

  return (
    <Flex flexDir='column' align='end' py={3} px={5}>
      <Text>El examen finaliza en:</Text>
      <Countdown
        date={Date.now() + 120000}
        renderer={renderer}
        // onComplete={onOpenFinishDialog}
      />
    </Flex>
  )
})
