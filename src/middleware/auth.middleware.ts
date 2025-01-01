import { User } from '@/schemas/schemas'
import { sendErrorResponse } from '@/utilities/utilities.responses'
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
    const decoded = jwt.verify(tokenWithoutPrefix, <string>process.env.SECRET)
    const userId = <string>decoded.userId
    if (!userId) {
      return sendErrorResponse('invalud jwt token', res, 403)
    }
    const user = await User.findById(userId)
    if (!user) {
      return sendErrorResponse('the such user no exist', res)
    }
    if (!user.isEmailVerify) {
      return sendErrorResponse('your email is not verify', res)
    }
    Object.assign(req, { userId })
    next()
  } catch (e: any) {
    res.status(403).send({ error: e.message })
  }
}
