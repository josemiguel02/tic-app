import { useReducer, useEffect } from 'react'
import QuizContext from './QuizContext'
import { QuizReducer } from './QuizReducer'
import { quizApi } from '@/api/quiz-api'
import { hasTokenAndIsUser } from '@/utils/check-user-type'

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
  // Usar el useState normal para ocultar las preguntas
  // const [secretQuestions, setSecretQuestions] = useState([])

  const setQuestionsSliced = (data: IPreguntas[]) => {
    dispatch({ type: '[QUIZ] - SLICE QUESTIONS', payload: data })
  }

  const loadQuestions = async () => {
    const isValidUser = await hasTokenAndIsUser()
    if (!isValidUser) {
      return
    }

    try {
      const { data } = await quizApi.get<IPreguntas[]>('/quiz/get-questions')

      const shuffleArr = data.sort(() => Math.random() - 0.5)

      dispatch({ type: '[QUIZ] - SET QUESTIONS', payload: shuffleArr })
      dispatch({ type: '[QUIZ] - SLICE QUESTIONS', payload: shuffleArr.slice(0, 1) })
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
