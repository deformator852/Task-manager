import { Request, Response, Router } from 'express'
import { UserService } from './user.service'
import jwt, { JwtPayload } from 'jsonwebtoken'
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '@/utilities/utilities.responses'
import { CreateUserDTO, LoginUserDTO } from '@/DTO/user.dto'
import { CustomJwtPayload } from '@/interface/jwt.interface'

const router = Router()
const service = new UserService()

router.post('/login/', async (req: Request, res: Response) => {
  const user: LoginUserDTO = req.body
  if (!user.username && user.password) {
    return sendErrorResponse('empty body', res, 401)
  }
  try {
    const accessToken = await service.login(user.username, user.password)
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
    const user: CreateUserDTO = req.body
    const tokens = await service.registration(
      user.username,
      user.email,
      user.password
    )
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    })
    sendSuccessResponse(tokens, res)
  } catch (e: any) {
    sendErrorResponse(e.message, res, 401)
  }
})

router.get('/activate/:link', async (req: Request, res: Response) => {
  try {
    await service.activate(req.params.link)
    return res.redirect(<string>process.env.CLIENT_URL)
  } catch (e: any) {
    sendErrorResponse(e.message, res)
  }
})
router.get('/refresh/', async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    return sendErrorResponse('Absent refresh token', res)
  }
  const decoded = <CustomJwtPayload>(
    jwt.verify(refreshToken, <string>process.env.SECRET)
  )
  const userId = decoded.userId
  if (!userId) {
    return sendErrorResponse('invalid refresh token', res)
  }
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
