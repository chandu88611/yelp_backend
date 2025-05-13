import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import { authenticateJWT } from "~/packages/api/middlewares/auth";
import { AuthenticatedRequest } from "../types/types";

export class CategoryRoutes {
  public router: Router;
  private categoryController: CategoryController;

  constructor() {
    this.router = Router();
    this.categoryController = new CategoryController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", authenticateJWT, (req: AuthenticatedRequest, res) =>
      this.categoryController.createCategory(req, res)
    );

    this.router.get("/", (req, res) =>
      this.categoryController.getAllCategories(req, res)
    );

    this.router.delete("/:id", authenticateJWT, (req, res) =>
      this.categoryController.deleteCategory(req, res)
    );

    this.router.put("/:id", authenticateJWT, (req, res) =>
      this.categoryController.updateCategory(req, res)
    );
  }
}
