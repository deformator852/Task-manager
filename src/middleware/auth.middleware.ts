import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { decode } from 'querystring'

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
    const decoded = jwt.verify(tokenWithoutPrefix, <string>process.env.SECRET)
    // console.log(tokenWithoutPrefix)
    console.log(decoded)
    req.user = decoded
    next()
  } catch (e: any) {
    res.status(403).send({ error: e.message })
  }
}
