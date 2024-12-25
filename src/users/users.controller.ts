import { Request, Response, Router } from 'express'
import { IUser } from '@/interface/users.interface'
import { UsersService } from './users.service'

export const router = Router()
const service = new UsersService()

router.get('auth/', (req: Request, res: Response) => {})
router.post('registration/', (req: Request, res: Response) => {})
