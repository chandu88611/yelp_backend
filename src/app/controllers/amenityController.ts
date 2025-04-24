import { Request, Response } from "express";
import { AmenityService } from "../services/amenityService";

export class AmenityController {
  private amenityService = new AmenityService();

  async createAmenity(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const amenity = await this.amenityService.createAmenity(name);
      return res.status(201).json({ success: true, data: amenity });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  
  async getAllAmenities(req: Request, res: Response) {
    try {
      const { search = "", page = "1", limit = "10" } = req.query;
      const result = await this.amenityService.getAllAmenities(
        search as string, 
        parseInt(page as string), 
        parseInt(limit as string)
      );
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
  

  async deleteAmenity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.amenityService.deleteAmenity(id);
      return res.status(200).json({ success: true, message: "Amenity deleted successfully." });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateAmenity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const updatedAmenity = await this.amenityService.updateAmenity(id, name);
      return res.status(200).json({ success: true, data: updatedAmenity });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
