import { Request, Response, Router, NextFunction } from 'express'
import { IUser } from '@/interface/users.interface'
import { UsersService } from './users.service'
import { Error } from 'mongoose'
import { exit } from 'process'

const router = Router()
const service = new UsersService()

router.post(
  '/login/',
  async (req: Request, res: Response, next: NextFunction) => {}
)
router.post(
  '/logout/',
  async (req: Request, res: Response, next: NextFunction) => {}
)
router.post('/registration/', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body
    const tokens = await service.registration(username, email, password)
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    })
    res.json(tokens)
  } catch (e: Error) {
    console.log(e)
    res.status(404).send({ error: e.message })
  }
})
router.get(
  '/activate/:link',
  async (req: Request, res: Response, next: NextFunction) => {
    res.send({ message: 'activate' })
  }
)
router.get(
  '/refresh/',
  async (req: Request, res: Response, next: NextFunction) => {
    res.send({ message: 'refresh' })
  }
)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: '/' })
})

export const usersRouter = router
