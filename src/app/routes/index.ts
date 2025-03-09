import { Router } from "express";
import { UserRoutes } from "./userRoutes";
import { BusinessRoutes } from "./businessRoutes";
// import { BusinessRoutes } from "./businessRoutes"; // Example: Add other routes
// import { ServiceRoutes } from "./serviceRoutes";   // Example: Add other routes

export class MainRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use("/users", new UserRoutes().router);
    this.router.use("/businesses", new BusinessRoutes().router);
    // this.router.use("/services", new ServiceRoutes().router);
  }
}
