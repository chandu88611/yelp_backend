import { Request, Response } from "express";
import { ServiceService } from "../services/businessService.service";

export class ServiceController {
  private serviceService = new ServiceService();

  async createService(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const service = await this.serviceService.createService(name);
      return res.status(201).json({ success: true, data: service });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

 
  async getAllServices(req: Request, res: Response) {
    try {
      const { search = "", page = "1", limit = "10" } = req.query;
      const result = await this.serviceService.getAllServices(
        search as string, 
        parseInt(page as string), 
        parseInt(limit as string)
      );
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteService(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.serviceService.deleteService(id);
      return res.status(200).json({ success: true, message: "Service deleted successfully." });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
  async updateService(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const updatedService = await this.serviceService.updateService(id, name);
      return res.status(200).json({ success: true, data: updatedService });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
