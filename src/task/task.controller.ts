import { Request, Response, Router } from 'express'
import { TaskService } from './task.service'
import { ITask } from '@/interface/task.interface'

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
        res.status(404).send({ error: 'invalid status' })
        return
      }
      const result = await service.taskStatusChange(userId, taskId, status)
      console.log(result)
      res.status(200).send({ message: 'success' })
    } catch (e: any) {
      res.status(404).send({ error: e.message })
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
      res.status(200).send(updateResult)
    }
  } catch (e: any) {
    res.status(404).send({ erorr: e.message })
  }
})
router.delete('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId
    const taskId = <string>req.query.task_id
    if (userId && taskId) {
      const deleteResult = await service.deleteOne(userId, taskId)
      res.status(200).send(deleteResult)
    }
  } catch (e: any) {
    res.status(404).send({ erorr: e.message })
  }
})

router.post('/', async (req: Request, res: Response) => {
  const body: ITask = req.body
  if (body) {
    const userId = <string>req.user.userId
    try {
      if (!userId) {
        res.status(403).send({ error: 'no user id' })
        return
      }
      //const refreshToken = req.cookies.refreshToken
      //if (!(await service.userIdentify(userId, refreshToken))) {
      //  res.status(403).send({ error: "can't identify user" })
      //  return
      //}
      await service.createTasks(body, userId)
      res.status(200).send(body)
    } catch (e) {
      res.status(404).send({ error: e })
    }
  } else {
    res.status(404).send({ error: 'Empty body' })
  }
})

router.get('/', async (req: Request, res: Response) => {
  const userId = <string>req.user.userId
  try {
    if (userId) {
      const taskId = <string>req.query.task_id
      const completedStatus = req.query.completed
      let result: [] | {} | null = null
      if (taskId) {
        result = await service.getOne(userId, taskId)
        if (result === null) {
          res.status(404).send({ error: "can't find task" })
          return
        }
      } else {
        result = await service.getAll(userId, completedStatus)
      }
      res.status(200).send(result)
    } else {
      res.status(403).send({ error: 'User id is absent' })
    }
  } catch (e: any) {
    res.status(404).send({ error: e.message })
  }
})

router.post
export const tasksRouter = router
