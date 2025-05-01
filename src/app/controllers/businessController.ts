import { Request, Response } from 'express'
import { BusinessService } from '../services/businessService'
import { ServiceService } from '../services/businessService.service'
import { AmenityService } from '../services/amenityService'
import { AuthenticatedRequest } from '../types/types'

export class BusinessController {
  private businessService: BusinessService
  private serviceService: ServiceService
  private amenityService: AmenityService

  constructor() {
    this.businessService = new BusinessService()
    this.serviceService = new ServiceService()
    this.amenityService = new AmenityService()
  }

  // ✅ Create Business
  async createBusiness(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        businessName,
        description,
        website,
        establishedYear,
        employeeCount,

        services,
        amenities,
      } = req.body

      const ownerId = req.user.id

      const business = await this.businessService.createBusiness({
        ownerId,
        businessName,
        description,
        website,
        establishedYear,
        employeeCount,

        services,
        amenities,
      })

      return res.status(201).json({ success: true, data: business })
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  // ✅ Update Business
  async updateBusinessDetails(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params
      const updateData = req.body

      const updated = await this.businessService.updateBusinessDetails(id, updateData)
      return res.status(200).json({ success: true, data: updated })
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message })
    }
  }

  // ✅ Upload Photos
  async uploadBusinessPhotos(req: AuthenticatedRequest, res: Response) {
    try {
      console.log('Request Body:', req.body) // To see if there is anything in the body
      console.log('Request Files:', req.files) // To see the uploaded files

      const { id } = req.params
      const userId = req.user.id
      const files = req.files as Express.Multer.File[]
      const { type } = req.body // Access the 'type' from the body

      if (!files || files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' })
      }

      const uploaded = await this.businessService.uploadBusinessPhotos(id, userId, files, type)
      console.log(uploaded)
      return res.status(200).json({ success: true, data: uploaded })
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message })
    }
  }

  // ✅ Delete Business Photo
  async deleteBusinessPhoto(req: Request, res: Response) {
    try {
      const { businessId, photoId } = req.params // Get business ID and photo ID from URL params

      const result = await this.businessService.deleteBusinessPhoto(businessId, photoId) // No userId needed

      return res.status(200).json({ success: true, message: result.message })
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message })
    }
  }

  // ✅ Update Booking & Other URLs
  async updateOtherDetails(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params
      const { specialOffers, bookingUrl, googleMapUrl } = req.body

      const updated = await this.businessService.updateBusinessDetails(id, {
        specialOffers,
        bookingUrl,
        googleMapUrl,
      })

      return res.status(200).json({ success: true, data: updated })
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message })
    }
  }

  // ✅ Get Single Business
  async getBusinessById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const business = await this.businessService.getBusinessById(id)
      return res.status(200).json({ success: true, data: business })
    } catch (error) {
      return res.status(404).json({ success: false, message: error.message })
    }
  }

  // ✅ Get All Businesses (with Search + Pagination)
  async getBusinesses(req: Request, res: Response) {
    try {
      const { page = '1', limit = '10', search = '' } = req.query

      const businesses = await this.businessService.getBusinesses(Number(page), Number(limit), search.toString())

      return res.status(200).json({ success: true, data: businesses })
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  // ✅ Delete Business
  async deleteBusiness(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params
      await this.businessService.deleteBusiness(id)
      return res.status(200).json({ success: true, message: 'Business deleted successfully' })
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message })
    }
  }
}
