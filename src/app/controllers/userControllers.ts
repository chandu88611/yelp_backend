import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { AuthenticatedRequest } from "../types/types";


export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // ✅ Register User
  async register(req: Request, res: Response) {
    try {
      const { fullName, email, password } = req.body;
      const user = await this.userService.registerUser(fullName, email, password);
      res.status(201).json({ success: true, user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ✅ Login User
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { token, user } = await this.userService.loginUser(email, password);
      res.status(200).json({ success: true, token, user });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  }

  // ✅ Get Profile (Protected)
  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const user = await this.userService.getUserProfile(userId!);
      res.status(200).json({ success: true, user });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  // ✅ List All Users
  async listUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.listUsers();
      res.status(200).json({ success: true, users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
