import { Request, Response, Router } from 'express'
import { TaskService } from './task.service'
import { ITask } from '@/interface/task.interface'
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '@/utilities/utilities.responses'

export const router = Router()
const service = new TaskService()

router.patch(
  '/:task_id/completed/:status',
  async (req: Request, res: Response) => {
    try {
      const taskId = <string>req.params.task_id
      const userId = <string>req.user.userId
      let status: string | boolean = <string>req.params.status
      if (status === 'false') {
        status = false
      } else if (status === 'true') {
        status = true
      } else {
        sendErrorResponse('invalid status', res)
        return
      }
      const result = await service.taskStatusChange(userId, taskId, status)
      sendSuccessResponse({ message: 'success' }, res)
    } catch (e: any) {
      sendErrorResponse(e.message, res)
    }
  }
)
router.patch('/', async (req: Request, res: Response) => {
  try {
    const userId = <string>req.user.userId
    const taskId = <string>req.query.task_id
    const fields = <object>req.body
    if (userId && taskId && fields) {
      const updateResult = await service.updateOne(userId, taskId, fields)
      sendSuccessResponse(updateResult, res)
    }
  } catch (e: any) {
    sendErrorResponse(e.message, res)
  }
})
router.delete('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId
    const taskId = <string>req.query.task_id
    if (userId && taskId) {
      const deleteResult = await service.deleteOne(userId, taskId)
      sendSuccessResponse(deleteResult, res)
    }
  } catch (e: any) {
    sendErrorResponse(e.message, res)
  }
})

router.post('/', async (req: Request, res: Response) => {
  const body: ITask = req.body
  if (body) {
    const userId = <string>req.user.userId
    try {
      if (!userId) {
        sendErrorResponse('no user id', res, 403)
        return
      }
      await service.createTasks(body, userId)
      sendSuccessResponse(body, res)
    } catch (e: any) {
      sendErrorResponse(e.message, res)
    }
  } else {
    sendErrorResponse('Empty body', res)
  }
})

router.get('/', async (req: Request, res: Response) => {
  const userId = <string>req.user.userId
  const taskId = <string>req.query.task_id
  const completedStatus = req.query.completed
  try {
    if (!userId) {
      sendErrorResponse('User id is absent', res, 403)
      return
    }
    if (taskId) {
      service
        .getOne(userId, taskId)
        .then((task) => {
          sendSuccessResponse(task, res)
        })
        .catch(async (e: Error) => {
          sendErrorResponse(e.message, res)
        })
      return
    }
    service
      .getAll(userId, completedStatus)
      .then((tasks) => {
        sendSuccessResponse(tasks, res)
      })
      .catch((e: Error) => {
        sendErrorResponse(e.message, res)
      })
  } catch (e: any) {
    sendErrorResponse(e.message, res)
  }
})

router.post
export const tasksRouter = router
