import type { IQuizState } from './QuizProvider'

type QuizActionType =
  | { type: '[QUIZ] - SET QUESTIONS'; payload: IPreguntas[] }
  | { type: '[QUIZ] - SLICE QUESTIONS'; payload: IPreguntas[] }
  | { type: '[QUIZ] - SET SCORE'; payload: number }
  | { type: '[QUIZ] - FINALIZE TYPING'; payload: boolean }

export const QuizReducer = (state: IQuizState, action: QuizActionType): IQuizState => {
  switch (action.type) {
    case '[QUIZ] - SET QUESTIONS':
      return { ...state, questions: action.payload }

    case '[QUIZ] - SLICE QUESTIONS':
      return { ...state, questionsSliced: action.payload }

    case '[QUIZ] - SET SCORE':
      return { ...state, finalScore: action.payload }

    case '[QUIZ] - FINALIZE TYPING':
      return { ...state, isFinishTyping: true }

    default:
      return state
  }
}
