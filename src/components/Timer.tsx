import React from 'react'
import Countdown, { type CountdownRenderProps } from 'react-countdown'
import { BoxProps, Flex, Text, Icon } from '@chakra-ui/react'
import { FaRegClock } from 'react-icons/fa'
import { useUI } from '@/hooks'

const renderer = ({ minutes, seconds, completed }: CountdownRenderProps) => {
  if (completed) return <Text>Se ha terminado el tiempo</Text>

  return (
    <Flex gap={2} align='center'>
      {/* https://github.com/ndresx/react-countdown/blob/master/examples/src/CountdownApi.tsx */}
      {/* <button onClick={() => api.start()}>Comenzar</button> */}

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
        // #TODO: Cuando se haga el complete del tiempo mostar un Modal diciendo que se ha acabado
        // y tiene que enviar el examen, nada más.
        onComplete={onOpenFinishDialog}
      />
    </Flex>
  )
})
