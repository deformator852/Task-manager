import { Request, Response, Router } from 'express'
import { UserService } from './user.service'
import jwt from 'jsonwebtoken'
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '@/utilities/utilities.responses'

const router = Router()
const service = new UserService()

router.post('/login/', async (req: Request, res: Response) => {
  const { username, password } = req.body
  if (!username && password) {
    return sendErrorResponse('empty body', res, 403)
  }
  try {
    const accessToken = await service.login(username, password)
    sendSuccessResponse({ accessToken }, res)
  } catch (e: any) {
    sendErrorResponse(e.message, res, 401)
  }
})
router.post('/logout/', async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    return sendErrorResponse('refresh token in required', res, 401)
  }
  try {
    await service.logout(refreshToken)
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
    })
    sendSuccessResponse({ message: 'success' }, res)
  } catch (e: any) {
    sendErrorResponse(e.message, res, 401)
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
    sendErrorResponse(e.message, res)
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
          sendSuccessResponse({ newAccessToken }, res)
        })
        .catch((e: any) => {
          sendErrorResponse(e.message, res)
        })
    } else {
      sendErrorResponse("you aren't auth", res, 401)
    }
  } catch (e: any) {
    sendErrorResponse(e.message, res)
  }
})

export const usersRouter = router
