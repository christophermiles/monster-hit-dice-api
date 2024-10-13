import type { ZodError } from 'zod'

export default function formatZodError(error: ZodError) {
  const firstIssue = error.errors[0]
  return {
    path: firstIssue.path.join('.'),
    message: firstIssue.message,
    validation: firstIssue.code,
  }
}
