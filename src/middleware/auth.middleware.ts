import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization
  if (!token) {
    res.status(403).send({ error: 'Authorization token is absent' })
    return
  }
  const tokenWithoutPrefix = token.split(' ')[1]
  try {
    jwt.verify(tokenWithoutPrefix, <string>process.env.SECRET)
    next()
  } catch (e: any) {
    res.status(403).send({ error: e.message })
  }
}
