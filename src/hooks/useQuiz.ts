import { useContext } from 'react'
import QuizContext from '@/context/quiz/QuizContext'

export const useQuiz = () => {
  const quizContext = useContext(QuizContext)

  return {
    ...quizContext
  }
}
