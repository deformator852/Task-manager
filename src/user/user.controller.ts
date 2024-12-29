import { Request, Response, Router, NextFunction } from 'express'
import { IUser } from '@/interface/users.interface'
import { UserService } from './user.service'
import { Error, Mongoose } from 'mongoose'
import jwt from 'jsonwebtoken'
import { User } from '@/schemas/schemas'
import { authMiddleware } from '@/middleware/auth.middleware'

const router = Router()
const service = new UserService()

router.post('/login/', async (req: Request, res: Response) => {
  const { username, password } = req.body
  if (!username && password) {
    res.status(403).send({ error: "empty body,can't auth" })
    return
  }
  try {
    const accessToken = await service.login(username, password)
    res.status(200).send({ accessToken })
  } catch (e: any) {
    res.status(403).send({ error: e.message })
  }
})
router.post('/logout/', async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    res.status(400).send({ message: 'Refresh token is required' })
    return
  }
  try {
    await service.logout(refreshToken)
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
    })
    res.status(200).send({ message: 'success' })
  } catch (e: any) {
    res.status(404).send({ error: e.message })
  }
})
router.post('/registration/', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body
    const tokens = await service.registration(username, email, password)
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    })
    res.json(tokens)
  } catch (e: any) {
    res.status(404).send({ error: e.message })
  }
})

router.get('/activate/:link', async (req: Request, res: Response) => {
  try {
    await service.activate(req.params.link)
    return res.redirect(<string>process.env.CLIENT_URL)
  } catch (e: any) {
    res.send({ error: e.message })
  }
})
router.get('/refresh/', async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken
  const decoded = jwt.verify(refreshToken, <string>process.env.SECRET)
  const userId = decoded.userId
  try {
    if (refreshToken) {
      service
        .refreshAccessToken(refreshToken, userId)
        .then((newAccessToken) => {
          res.status(200).send({ newAccessToken })
        })
        .catch((e: any) => {
          res.status(404).send({ error: e.message })
        })
    } else {
      res.status(401).send({ error: "You aren't auth" })
    }
  } catch (e: any) {
    res.status(404).send({ error: e.message })
  }
})

export const usersRouter = router
