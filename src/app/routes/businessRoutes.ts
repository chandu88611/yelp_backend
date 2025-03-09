import  { Router } from "express";
import { BusinessController } from "../controllers/businessController";
import { authenticateJWT } from "~/packages/api/middlewares/auth";
import { AuthenticatedRequest } from "../types/types";
 

export class BusinessRoutes {
  public router: Router;
  private businessController: BusinessController;

  constructor() {
    this.router = Router();
    this.businessController = new BusinessController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", authenticateJWT, (req:AuthenticatedRequest, res) => this.businessController.createBusiness(req, res));
    this.router.get("/", (req, res) => this.businessController.listBusinesses(req, res));
    this.router.get("/:id", (req, res) => this.businessController.getBusinessById(req, res));
    this.router.put("/:id", authenticateJWT, (req, res) => this.businessController.updateBusiness(req, res));
    this.router.delete("/:id", authenticateJWT, (req, res) => this.businessController.deleteBusiness(req, res));
  }
}
