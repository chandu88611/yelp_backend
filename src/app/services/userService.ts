 
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import dataSource from "ormconfig";
import config from "~/config";
import { User } from "~/packages/database/models/User";

export class UserService {
  private userRepository = dataSource.getRepository(User);

  // ✅ Register User
  async registerUser(fullName: string, email: string, password: string) {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) throw new Error("Email already in use");

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Use `passwordHash` instead of `password`
    const user = this.userRepository.create({ 
      fullName, 
      email, 
      passwordHash: hashedPassword 
    });

    await this.userRepository.save(user);
    return user;
  }

  // ✅ Login User & Generate JWT
  async loginUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new Error("Invalid Email or Password");

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new Error("Invalid Email or Password");

    const token = jwt.sign({ id: user.id, email: user.email }, config.AUTH.TOKEN_SECRET, { expiresIn: "1h" });

    return { user, token };
  }

  // ✅ Get User Profile
  async getUserProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    return user;
  }

  // ✅ List All Users
  async listUsers() {
    return this.userRepository.find();
  }
}
