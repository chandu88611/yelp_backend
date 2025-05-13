import { Request, Response } from "express";
import { CategoryService } from "../services/categoryService";

export class CategoryController {
  private categoryService = new CategoryService();

  async createCategory(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const category = await this.categoryService.createCategory(name);
      return res.status(201).json({ success: true, data: category });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAllCategories(req: Request, res: Response) {
    try {
      const { search = "", page = "1", limit = "10" } = req.query;
      const result = await this.categoryService.getAllCategories(
        search as string,
        parseInt(page as string),
        parseInt(limit as string)
      );
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.categoryService.deleteCategory(id);
      return res.status(200).json({ success: true, message: "Category deleted successfully." });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const updatedCategory = await this.categoryService.updateCategory(id, name);
      return res.status(200).json({ success: true, data: updatedCategory });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
