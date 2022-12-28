import { useState, useEffect, useRef } from 'react'
import useTyping, { PhaseType } from 'react-typing-game-hook'
import { Box, Text, keyframes } from '@chakra-ui/react'
import { useQuiz } from '@/hooks'

const blink = keyframes`
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
`

interface TypingInputProps {
  text: string
  score: number
}

export const TypingInput: FCC<TypingInputProps> = ({ text, score }) => {
  const [isFocused, setIsFocused] = useState(false)
  const { finishTyping, finalScore, addFinalScore } = useQuiz()
  const typingRef = useRef<HTMLDivElement>(null)
  const myScore = useRef(finalScore)

  const {
    states: {
      charsState,
      currIndex,
      correctChar,
      phase
    },
    actions: { insertTyping }
  } = useTyping(text, {
    countErrors: 'once'
  })

  const accuracy = Math.round(Number(((correctChar / text.length) * 100).toFixed(2)))

  const handleKey = (key: any) => {
    if (key.length === 1) {
      insertTyping(key)
    }
  }

  // Set Score and finish Typing
  useEffect(() => {
    if (phase === PhaseType.Ended) {
      finishTyping()

      const typingScore = (accuracy * score) / 100

      // Aumentar score
      addFinalScore((myScore.current += typingScore))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  useEffect(() => {
    typingRef.current?.focus()
  }, [])

  return (
    <div>
      <Text color='gray.500' fontSize='sm' mb={5}>
        Haga clic en el texto a continuación y comience a escribir
      </Text>

      <Box
        tabIndex={0}
        ref={typingRef}
        outline='none'
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={e => {
          handleKey(e.key)
          e.preventDefault()
        }}
      >
        <Box
          fontFamily='typingFont'
          fontSize='1.7rem'
          fontWeight='semibold'
          letterSpacing='wide'
          pointerEvents='none'
          userSelect='none'
        >
          {text.split('').map((letter, idx) => {
            let state = charsState[idx]
            let hightlight = currIndex + 1 === idx
            let color = state === 0 ? 'gray.600' : state === 1 ? 'green.500' : 'red.500'

            return (
              <Text
                as='span'
                key={letter + idx}
                color={color}
                pos='relative'
                _after={
                  hightlight && isFocused
                    ? {
                      content: '""',
                      display: 'inline-block',
                      w: '3px',
                      h: '32px',
                      bg: 'primary',
                      pos: 'absolute',
                      top: '50%',
                      left: '-3px',
                      transform: 'translateY(-50%)',
                      animation: `${blink} 1.2s infinite`,
                      transition: '0.12s'
                    }
                    : {}
                }
              >
                {letter}
              </Text>
            )
          })}
        </Box>
      </Box>
    </div>
  )
}
