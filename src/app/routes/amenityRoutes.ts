import { Router } from "express";
import { AmenityController } from "../controllers/amenityController";

import { authenticateJWT } from "~/packages/api/middlewares/auth";
import { AuthenticatedRequest } from "../types/types";

export class AmenityRoutes {
  public router: Router;
  private amenityController: AmenityController;

  constructor() {
    this.router = Router();
    this.amenityController = new AmenityController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", authenticateJWT, (req: AuthenticatedRequest, res) => 
      this.amenityController.createAmenity(req, res)
    );

    this.router.get("/", (req, res) => 
      this.amenityController.getAllAmenities(req, res)
    );

    this.router.delete("/:id", authenticateJWT, (req, res) => 
      this.amenityController.deleteAmenity(req, res)
    );
    this.router.put("/:id", authenticateJWT, (req, res) => 
        this.amenityController.updateAmenity(req, res)
      );
  }
}
