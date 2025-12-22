import { AppError } from './app-error'

export const ERR = {
  UNAUTHORIZED(message = 'Unauthorized') {
    return new AppError(message, 401, 'UNAUTHORIZED')
  },

  NOT_FOUND(message = 'Not found') {
    return new AppError(message, 404, 'NOT_FOUND')
  },

  BAD_REQUEST(message = 'Bad request') {
    return new AppError(message, 400, 'BAD_REQUEST')
  },

  CONFLICT(message = 'Conflict') {
    return new AppError(message, 409, 'CONFLICT')
  },

  INTERNAL(message = 'Internal error') {
    return new AppError(message, 500, 'INTERNAL')
  },
} as const
