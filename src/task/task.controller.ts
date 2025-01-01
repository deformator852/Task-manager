import { Response, Router } from 'express'
import { TaskService } from './task.service'
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '@/utilities/utilities.responses'
import { AuthRequest } from '@/interface/request.interface'
import { CreateTaskDTO, TaskResponseDTO } from '@/DTO/task.dto'

export const router = Router()
const service = new TaskService()

router.get('/overdue', async (req: AuthRequest, res: Response) => {})
router.patch(
  '/:task_id/completed/:status',
  async (req: AuthRequest, res: Response) => {
    try {
      const taskId = <string>req.params.task_id
      const userId = <string>req.userId
      let status: string | boolean = <string>req.params.status
      if (status === 'false') {
        status = false
      } else if (status === 'true') {
        status = true
      } else {
        return sendErrorResponse('invalid status', res)
      }
      const result = await service.taskStatusChange(userId, taskId, status)
      sendSuccessResponse({ message: 'success' }, res)
    } catch (e: any) {
      sendErrorResponse(e.message, res)
    }
  }
)
router.patch('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = <string>req.userId
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
router.delete('/:task_id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId
    const taskId = <string>req.params.task_id
    if (userId && taskId) {
      const deleteResult = await service.deleteOne(userId, taskId)
      return sendSuccessResponse(deleteResult, res)
    }
    sendErrorResponse('absent user id or task id', res)
  } catch (e: any) {
    sendErrorResponse(e.message, res)
  }
})

router.post('/', async (req: AuthRequest, res: Response) => {
  const task: CreateTaskDTO = req.body
  if (!task) {
    return sendErrorResponse('Empty body', res)
  }
  const userId = <string>req.userId
  try {
    if (!userId) {
      return sendErrorResponse('no user id', res, 403)
    }
    await service.createTasks(task, userId)
    sendSuccessResponse(task, res)
  } catch (e: any) {
    sendErrorResponse(e.message, res)
  }
})

router.get('/', async (req: AuthRequest, res: Response) => {
  const userId = <string>req.userId
  const taskId = <string>req.query.task_id
  const completedStatus = <string>req.query.completed
  try {
    if (!userId) {
      return sendErrorResponse('User id is absent', res, 403)
    }
    if (taskId) {
      service
        .getOne(userId, taskId)
        .then((task: TaskResponseDTO) => {
          sendSuccessResponse(task, res)
        })
        .catch((e: Error) => {
          sendErrorResponse(e.message, res)
        })
      return
    }
    service
      .getAll(userId, completedStatus)
      .then((tasks: TaskResponseDTO[]) => {
        sendSuccessResponse(tasks, res)
      })
      .catch((e: Error) => {
        sendErrorResponse(e.message, res)
      })
  } catch (e: any) {
    sendErrorResponse(e.message, res)
  }
})

export const tasksRouter = router
