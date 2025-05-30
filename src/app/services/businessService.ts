import { Like, ILike } from "typeorm";
import dataSource from "ormconfig";
import { Business } from "~/packages/database/models/Business";
import { User } from "~/packages/database/models/User";
import { Photo } from "~/packages/database/models/Photo";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { Amenity } from "~/packages/database/models/Amenity";


export class BusinessService {
  private businessRepository = dataSource.getRepository(Business);
  private amenityRepository = dataSource.getRepository(Amenity);
  private photoRepository = dataSource.getRepository(Photo);
  private userRepository = dataSource.getRepository(User);

  // ✅ Upload Images to GoDaddy Server & Store in Database

  async uploadBusinessPhotos(businessId: string, userId: string, files: Express.Multer.File[]) {
    const business = await this.businessRepository.findOne({ where: { id: businessId }, relations: ["owner"] });
    if (!business) throw new Error("Business not found");
  
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");
  
    const uploadUrls: string[] = [];
  
    const imagesDir = path.join(__dirname, "..", "..", "public", "images");
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
  
    for (const file of files) {
      try {
        const fileExt = path.extname(file.originalname);
        const fileName = `${uuidv4()}${fileExt}`;
        const filePath = path.join(imagesDir, fileName);
        const relativePath = `/images/${fileName}`;
  
        fs.writeFileSync(filePath, file.buffer); // Save file locally
  
        const photo = this.photoRepository.create({ business, user, photoUrl: relativePath });
        await this.photoRepository.save(photo);
  
        uploadUrls.push(relativePath);
      } catch (error) {
        console.error(`Error uploading ${file.originalname}:`, error);
      }
    }
  
    return { success: true, uploadedImages: uploadUrls };
  }
  

  // ✅ Update Business Basic Details
  async updateBusinessDetails(businessId: string, updateData: Partial<Business>) {
    const business = await this.businessRepository.findOne({ where: { id: businessId } });
    if (!business) throw new Error("Business not found");

    Object.assign(business, updateData);
    return await this.businessRepository.save(business);
  }

  // ✅ Create a New Business
  async createBusiness(businessData: Partial<Business> & { ownerId: string, services?: string[], amenities?: string[] }) {
    const owner = await this.userRepository.findOne({ where: { id: businessData.ownerId } });
    if (!owner) throw new Error("Owner not found");
  
    // Fetch amenities by IDs
    let amenities = [];
    if (businessData.amenities && businessData.amenities.length > 0) {
      amenities = await this.amenityRepository.findByIds(businessData.amenities);
    }
  
    const business = this.businessRepository.create({
      ...businessData,
      owner,
      amenities, // <-- Attach fetched amenities
      services: businessData.services || [], // safe fallback
    });
  
    return await this.businessRepository.save(business);
  }
  

  // ✅ Get Business by ID
  async getBusinessById(businessId: string) {
    const business = await this.businessRepository.findOne({
      where: { id: businessId },
      relations: [ "amenities"], // removed "services"
    });
  
    if (!business) throw new Error("Business not found");
    return business;
  }
  

  // ✅ Get Businesses with Search and Pagination
  async getBusinesses(
    page = 1,
    limit = 10,
    search = ""
  ): Promise<{ data: Business[]; total: number }> {
    const [data, total] = await this.businessRepository.findAndCount({
      where: [
        { businessName: ILike(`%${search}%`) },
        { city: ILike(`%${search}%`) },
        { description: ILike(`%${search}%`) },
      ],
      relations: ["owner",  "amenities", "categories"],
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  // ✅ Delete Business
  async deleteBusiness(businessId: string) {
    const business = await this.businessRepository.findOne({ where: { id: businessId } });
    if (!business) throw new Error("Business not found");

    await this.businessRepository.remove(business);
    return { success: true, message: "Business deleted successfully" };
  }
}
