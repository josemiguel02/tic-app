import { useReducer, useEffect } from 'react'
import QuizContext from './QuizContext'
import { QuizReducer } from './QuizReducer'
import { ticApi } from '@/api/tic-api'
import { getAuthCookie } from '@/utils/cookies'
// import { hasTokenAndIsUser } from '@/utils/check-user-type'

export interface IQuizState {
  questions: IPreguntas[]
  questionsSliced: IPreguntas[]
  finalScore: number
  isFinishTyping: boolean
}

const QUIZ_INITIAL_STATE: IQuizState = {
  questions: [],
  questionsSliced: [],
  finalScore: 0,
  isFinishTyping: false
}

const QuizProvider: FCC = ({ children }) => {
  const [state, dispatch] = useReducer(QuizReducer, QUIZ_INITIAL_STATE)

  const setQuestionsSliced = (data: IPreguntas[]) => {
    dispatch({ type: '[QUIZ] - SLICE QUESTIONS', payload: data })
  }

  const loadQuestions = async () => {
    // const isValidUser = await hasTokenAndIsUser()
    // if (!getAuthCookie()) {
    //   return
    // }

    try {
      const { data } = await ticApi.get<IPreguntas[]>('/quiz/get-questions')
      const shuffleArr = data.sort(() => Math.random() - 0.5).slice(0, 1)
      dispatch({ type: '[QUIZ] - SET QUESTIONS', payload: data })
      dispatch({ type: '[QUIZ] - SLICE QUESTIONS', payload: shuffleArr })
    } catch (error) {
      dispatch({ type: '[QUIZ] - SET QUESTIONS', payload: [] })
    }
  }

  const finishTyping = () => {
    dispatch({ type: '[QUIZ] - FINALIZE TYPING', payload: true })
  }

  const addFinalScore = (score: number) => {
    dispatch({ type: '[QUIZ] - SET SCORE', payload: score })
  }

  useEffect(() => {
    loadQuestions()
  }, [])

  return (
    <QuizContext.Provider
      value={{
        ...state,
        // Methods
        finishTyping,
        addFinalScore,
        setQuestionsSliced
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export default QuizProvider
