import { Router } from 'express'
import passport from 'passport'
import { UserController } from '../controllers/userControllers'
import { AuthenticatedRequest } from '../types/types'
import { authenticateJWT } from '~/packages/api/middlewares/auth'

export class UserRoutes {
  public router: Router
  private userController: UserController

  constructor() {
    this.router = Router()
    this.userController = new UserController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post('/register', (req, res) => this.userController.register(req, res))
    this.router.post('/login', (req, res) => this.userController.login(req, res))

    this.router.get('/profile', authenticateJWT, (req: AuthenticatedRequest, res) =>
      this.userController.getProfile(req, res),
    )

    this.router.get('/users', authenticateJWT, (req, res) => this.userController.listUsers(req, res))
  }
}
