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
      const { fullName, email, password,role } = req.body;
      const user = await this.userService.registerUser(fullName, email, password,role);
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

  // ✅ List All Users (Admin)
  async listUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.listUsers();
      res.status(200).json({ success: true, users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ✅ Update User (Admin / Self)
  async updateUser(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.params.id;
      const updateData = req.body;
      const updatedUser = await this.userService.updateUser(userId, updateData);
      res.status(200).json({ success: true, user: updatedUser });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ✅ Delete User (Admin)
  async deleteUser(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.params.id;
      await this.userService.deleteUser(userId);
      res.status(200).json({ success: true, message: "User deleted successfully." });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ✅ Update Password (Protected Route)
  async updatePassword(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id!;
      const { currentPassword, newPassword } = req.body;
      await this.userService.updatePassword(userId, currentPassword, newPassword);
      res.status(200).json({ success: true, message: "Password updated successfully." });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ✅ Reset Password (Forgot Password Flow)
  async resetPassword(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;
      await this.userService.resetPassword(token, newPassword);
      res.status(200).json({ success: true, message: "Password reset successfully." });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
