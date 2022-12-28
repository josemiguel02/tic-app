import React, { useEffect, useRef, useState } from 'react'
import useTyping, { PhaseType } from 'react-typing-game-hook'
import { Box, Input, Text } from '@chakra-ui/react'
import { useQuiz } from '@/hooks'

interface TypingInputAltProps {
  text: string
  score: number
}

export const TypingInputAlt: FCC<TypingInputAltProps> = ({ text, score }) => {
  const [typingInput, setTypingInput] = useState('')
  const [typedWrong, setTypeWrong] = useState(false)
  const inputRef = useRef<any>(null)
  const { finishTyping, finalScore, addFinalScore } = useQuiz()
  const myScore = useRef(finalScore)

  const {
    states: {
      charsState,
      currIndex,
      phase,
      correctChar
    },
    actions: { insertTyping }
  } = useTyping(text, {
    skipCurrentWordOnSpace: false,
    countErrors: 'once'
  })

  const [currWordPos, setCurrWordPos] = useState([-1, -1])

  const accuracy = Math.round(Number(((correctChar / text.length) * 100).toFixed(2)))

  //checks whether the word is correct while the user is typing
  useEffect(() => {
    setTypeWrong((prev: boolean): boolean => {
      let hasError = false
      for (let i = 0; i < typingInput.length; i++) {
        let char = typingInput[i]
        let correctChar = text[currWordPos[0] + i]
        let diff = char !== correctChar
        if (diff) {
          hasError = true
          break
        }
      }

      if (hasError !== prev) {
        return !prev
      } else {
        return prev
      }
    })
  }, [typingInput, currWordPos, text])

  //Set the start and end index of the next word
  useEffect(() => {
    let tempCurrIndex = text[currIndex] === ' ' ? currIndex + 1 : currIndex
    let startIndex = text.lastIndexOf(' ', tempCurrIndex)
    startIndex = startIndex < 0 ? 0 : startIndex + 1
    let endIndex = text.indexOf(' ', tempCurrIndex)
    endIndex = endIndex < 0 ? text.length - 1 : endIndex - 1

    setCurrWordPos(oldcurrWordPos => {
      if (startIndex !== oldcurrWordPos[0] || endIndex !== oldcurrWordPos[1]) {
        return [startIndex, endIndex]
      }
      return oldcurrWordPos
    })
  }, [currIndex, text])

  //Submit inputted word
  const submitWord = () => {
    for (let i = currWordPos[0]; i <= currWordPos[1]; i++) {
      let index = i - currIndex - 1
      if (index > typingInput.length - 1) {
        insertTyping()
      } else {
        insertTyping(typingInput[index])
      }
    }
    insertTyping(' ')
    setTypingInput('')
    setTypeWrong(false)
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

  return (
    <div>
      <Text color='gray.500' fontSize='sm' mb={5}>
        Haga clic en el campo de texto y comience a escribir
      </Text>

      <div
        tabIndex={0}
        onClick={() => {
          inputRef.current.focus()
        }}
      >
        <Box
          fontFamily='typingFont'
          fontSize='2xl'
          fontWeight='semibold'
          letterSpacing='wide'
          pointerEvents='none'
          userSelect='none'
        >
          {text.split('').map((letter, i) => {
            let shouldHightlight = i >= currWordPos[0] && i <= currWordPos[1]
            let state = charsState[i]

            let colorStyle = shouldHightlight
              ? 'white'
              : state === 0
                ? 'gray.600'
                : state === 1
                  ? 'green'
                  : 'red'

            let bgStyle = shouldHightlight ? 'primary' : ''

            return (
              <Text
                as='span'
                key={letter + i}
                color={colorStyle}
                bg={bgStyle}
              >
                {letter}
              </Text>
            )
          })}
        </Box>

        <Box my={10}>
          <Input
            type='text'
            variant='filled'
            ref={inputRef}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                submitWord()
              }
            }}
            onChange={e => {
              setTypingInput(e.target.value)
            }}
            value={typingInput}
            autoCorrect='off'
            autoCapitalize='none'
            spellCheck={false}
            placeholder={
              phase !== 1
                ? 'Escriba aquí... (Presione enter o espacio para enviar la palabra)'
                : ''
            }
            _focus={{
              borderColor: !typingInput.length
                ? 'gray.500'
                : typedWrong
                  ? 'red.500'
                  : 'green.500'
            }}
          />
        </Box>
      </div>
    </div>
  )
}
