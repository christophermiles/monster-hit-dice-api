import { HTTPException } from 'hono/http-exception'

export class BadRequestError extends HTTPException {
  constructor(message: string = 'Bad request') {
    super(400, { message })
  }
}

export class InternalServerError extends HTTPException {
  constructor(message: string = 'Internal server error', res?: Response) {
    super(500, { message, res })
  }
}
