import { Router } from "express";
import { ServiceController } from "../controllers/serviceController";
 
import { authenticateJWT } from "~/packages/api/middlewares/auth";
import { AuthenticatedRequest } from "../types/types";

export class ServiceRoutes {
  public router: Router;
  private serviceController: ServiceController;

  constructor() {
    this.router = Router();
    this.serviceController = new ServiceController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", authenticateJWT, (req: AuthenticatedRequest, res) => 
      this.serviceController.createService(req, res)
    );
    
    this.router.get("/", (req, res) => 
      this.serviceController.getAllServices(req, res)
    );

    this.router.delete("/:id", authenticateJWT, (req, res) => 
      this.serviceController.deleteService(req, res)
    );
    this.router.put("/:id", authenticateJWT, (req, res) => 
        this.serviceController.updateService(req, res)
      );
  }
}
