import { Request, Response } from "express";
import { BusinessService } from "../services/businessService";
import { AuthenticatedRequest } from "../types/types";
 

export class BusinessController {
  private businessService: BusinessService;

  constructor() {
    this.businessService = new BusinessService();
  }

  // ✅ Create a New Business
  async createBusiness(req: AuthenticatedRequest, res: Response) {
    try {
      const ownerId = req.user.id;  
      const business = await this.businessService.createBusiness(ownerId, req.body);
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
