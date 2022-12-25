/* eslint-disable no-unused-vars */
import React from 'react'

interface IQuizContext {
  questions: IPreguntas[]
  questionsSliced: IPreguntas[]
  finalScore: number
  isFinishTyping: boolean
  finishTyping: () => void
  addFinalScore: (score: number) => void
  setQuestionsSliced: (data: IPreguntas[]) => void
}

const QuizContext = React.createContext({} as IQuizContext)

export default QuizContext
