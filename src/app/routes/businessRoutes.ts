import { Router } from 'express'
import { BusinessController } from '../controllers/businessController'
import { authenticateJWT } from '~/packages/api/middlewares/auth'
import { AuthenticatedRequest } from '../types/types'
import * as multer from 'multer'

// ✅ Configure Multer (Store files in memory before sending to GoDaddy)
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

export class BusinessRoutes {
  public router: Router
  private businessController: BusinessController

  constructor() {
    this.router = Router()
    this.businessController = new BusinessController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post('/', authenticateJWT, (req: AuthenticatedRequest, res) =>
      this.businessController.createBusiness(req, res),
    )
    this.router.get('/', (req, res) => this.businessController.getBusinesses(req, res))
    this.router.get('/:id', (req, res) => this.businessController.getBusinessById(req, res))
    this.router.put('/:id', authenticateJWT, (req: AuthenticatedRequest, res) =>
      this.businessController.updateBusinessDetails(req, res),
    )
    this.router.delete('/:id', authenticateJWT, (req: AuthenticatedRequest, res) =>
      this.businessController.deleteBusiness(req, res),
    )
    this.router.put('/basic-details/:id', authenticateJWT, (req: AuthenticatedRequest, res) =>
      this.businessController.updateBusinessDetails(req, res),
    )

    // ✅ Upload Business Photos
    this.router.post(
      '/upload-photos/:id',
      authenticateJWT,
      upload.array('images', 10),
      (req: AuthenticatedRequest, res) => this.businessController.uploadBusinessPhotos(req, res),
    )

    // ✅ Delete Business Photo
    this.router.delete('/delete-photo/:businessId/:photoId', authenticateJWT, (req: AuthenticatedRequest, res) =>
      this.businessController.deleteBusinessPhoto(req, res),
    )

    // ✅ Update Other Business Details
    this.router.put('/other-details/:id', authenticateJWT, (req: AuthenticatedRequest, res) =>
      this.businessController.updateOtherDetails(req, res),
    )
  }
}
