import { Request, Response, Router } from 'express'
import { TasksService } from './tasks.service'
import { ITask } from '@/interface/task.interface'

export const router = Router()
const service = new TasksService()
router.post('/', async (req: Request, res: Response) => {
  const body: ITask = req.body
  if (body) {
    const userId = 1
    try {
      if (!userId) {
        res.status(403).send({ error: 'no user id' })
        return
      }
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
  const userId = 1
  if (userId) {
    const tasks = await service.getAll(userId)
    res.status(200).send(tasks)
  } else {
    res.status(403).send({ error: 'no user id' })
  }
})

export const tasksRouter = router
