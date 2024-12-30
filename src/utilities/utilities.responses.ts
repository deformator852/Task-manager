import { Response } from 'express'

export function sendErrorResponse(
  data: {} | string,
  res: Response,
  status: number = 404
): void {
  res.status(status).send({ error: data })
}

export function sendSuccessResponse(
  data: {} | [],
  res: Response,
  status: number = 200
): void {
  res.status(status).send(data)
}
