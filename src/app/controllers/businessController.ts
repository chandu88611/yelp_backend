import { Request, Response } from "express";
import { BusinessService } from "../services/businessService";
import { AuthenticatedRequest } from "../types/types";
import { ServiceService } from "../services/businessService.service";
import { AmenityService } from "../services/amenityService";
// import multer from "multer";
 

// // ✅ Explicitly Import Multer Types
 

// const upload = multer();

export class BusinessController {
  private businessService: BusinessService;
  private serviceService: ServiceService;
  private amenityService: AmenityService;

  constructor() {
    this.businessService = new BusinessService();
    this.serviceService = new ServiceService();
    this.amenityService = new AmenityService();
  }


  async updateBusinessDetails(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params; // Business ID
      const updateData = req.body;

      const updatedBusiness = await this.businessService.updateBusinessDetails(id, updateData);
      return res.status(200).json({ success: true, data: updatedBusiness });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // ✅ Upload Business Photos
  async uploadBusinessPhotos(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params; // Business ID
      const userId = req.user.id;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ success: false, message: "No files uploaded" });
      }

      const uploadedPhotos = await this.businessService.uploadBusinessPhotos(id, userId, files);
      return res.status(200).json({ success: true, data: uploadedPhotos });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // ✅ Update Other Business Details
  async updateOtherDetails(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { specialOffers, bookingUrl, googleMapUrl } = req.body;

      const updatedBusiness = await this.businessService.updateBusinessDetails(id, {
        specialOffers,
        bookingUrl,
        googleMapUrl,
      });

      return res.status(200).json({ success: true, data: updatedBusiness });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // ✅ Create a New Business
  async createBusiness(req: AuthenticatedRequest, res: Response) {
    try {
        const {
            name,
            description,
            phone,
            email,
            website,
            address,
            city,
            state,
            zipCode,
            country,
            latitude,
            longitude,
            
            facebookUrl,
            instagramUrl,
            twitterUrl,
            linkedinUrl,
            // ownerName,
            // ownerContact,
            // additionalInfo,
            googleMapUrl,
            services = [],  // Ensure it's an array
            amenities = [], // Ensure it's an array
          } = req.body;
          const socialLinks = JSON.stringify({
            facebookUrl,
            instagramUrl,
            twitterUrl,
            linkedinUrl,
          });
          const transformedServices = await this.serviceService.getServicesByIds(services);
          const transformedAmenities = await this.amenityService.getAmenitiesByIds(amenities);
    
      const ownerId = req.user.id;  
      const business = await this.businessService.createBusiness(ownerId, {
        name,
        description,
        phone,
        email,
        website,
        address,
        city,
        state,
        zipCode,
        country,
        socialLinks,
        // ownerName,
        // ownerContact,
        // additionalInfo,
        googleMapUrl,
        services: transformedServices,  // ✅ Pass actual entities
        amenities: transformedAmenities, // ✅ Pass actual entities
      });
      return res.status(201).json({ success: true, data: business });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // ✅ Get Business by ID
  async getBusinessById(req: Request, res: Response) {
    try {
      const business = await this.businessService.getBusinessById(req.params.id);
      return res.status(200).json({ success: true, data: business });
    } catch (error) {
      return res.status(404).json({ success: false, message: error.message });
    }
  }

  // ✅ List Businesses with Search & Pagination
  async listBusinesses(req: Request, res: Response) {
    try {
      const search = req.query.search as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.businessService.listBusinesses(search, page, limit);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // ✅ Update Business
  async updateBusiness(req: Request, res: Response) {
    try {
      const business = await this.businessService.updateBusiness(req.params.id, req.body);
      return res.status(200).json({ success: true, data: business });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // ✅ Delete Business
  async deleteBusiness(req: Request, res: Response) {
    try {
      await this.businessService.deleteBusiness(req.params.id);
      return res.status(200).json({ success: true, message: "Business deleted successfully" });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
