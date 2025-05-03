import { Router } from 'express'
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
    // ** Register **
    this.router.post('/register', (req, res) => this.userController.register(req, res))

    // ** Login **
    this.router.post('/login', (req, res) => this.userController.login(req, res))

    // ** Get Profile **
    this.router.get('/profile', authenticateJWT, (req: AuthenticatedRequest, res) =>
      this.userController.getProfile(req, res),
    )

    // ** List All Users **
    this.router.get('/', authenticateJWT, (req: AuthenticatedRequest, res) => this.userController.listUsers(req, res))

    // ** Update User **
    this.router.put('/users/:id', authenticateJWT, (req: AuthenticatedRequest, res) =>
      this.userController.updateUser(req, res),
    )

    // ** Delete User **
    this.router.delete('/:id', authenticateJWT, (req: AuthenticatedRequest, res) =>
      this.userController.deleteUser(req, res),
    )

    // ** Update Password (Protected) **
    this.router.put('/update-password', authenticateJWT, (req: AuthenticatedRequest, res) =>
      this.userController.updatePassword(req, res),
    )

    // ** Reset Password (Public) **
    this.router.post('/reset-password/:token', (req, res) => this.userController.resetPassword(req, res))
  }
}
