import { Like } from "typeorm";
import dataSource from "ormconfig";
import { Business } from "~/packages/database/models/Business";
import { User } from "~/packages/database/models/User";
import { Photo } from "~/packages/database/models/Photo";
import axios from "axios";

export class BusinessService {
  private businessRepository = dataSource.getRepository(Business);
  private photoRepository = dataSource.getRepository(Photo);
  private userRepository = dataSource.getRepository(User);

  // ✅ Upload Images to GoDaddy Server & Store in Database
  async uploadBusinessPhotos(businessId: string, userId: string, files: Express.Multer.File[]) {
    const business = await this.businessRepository.findOne({ where: { id: businessId }, relations: ["owner"] });
    if (!business) throw new Error("Business not found");

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const uploadUrls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      // formData.append("file", file.buffer, file.originalname);

      try {
        const response = await axios.post("https://spacentresnearme.com/upload.php", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.success) {
          const imageUrl = response.data.url;
          uploadUrls.push(imageUrl);

          // ✅ Save Image URL in Database
          const photo = this.photoRepository.create({ business, user, photoUrl: imageUrl });
          await this.photoRepository.save(photo);
        } else {
          console.error(`Failed to upload ${file.originalname}: ${response.data.message}`);
        }
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

  // ✅ Update Business Other Details (Services, Amenities, Categories)
  async updateBusinessOtherDetails(businessId: string, serviceIds: string[], amenityIds: string[], categoryIds: string[]) {
    const business = await this.businessRepository.findOne({ where: { id: businessId } });
    if (!business) throw new Error("Business not found");

    // business?.services = serviceIds.length ? await dataSource.getRepository(Service).find({ where: { id: In(serviceIds) } }) : [];
    // business?.amenities = amenityIds.length ? await dataSource.getRepository(Amenity).find({ where: { id: In(amenityIds) } }) : [];
    // business?.categories = categoryIds.length ? await dataSource.getRepository(Category).find({ where: { id: In(categoryIds) } }) : [];

    return await this.businessRepository.save(business);
  }
  // ✅ Create a New Business
  async createBusiness(ownerId: string, businessData: Partial<Business>) {
      const owner = await dataSource.getRepository(User).findOne({ where: { id: ownerId } });
      if (!owner) throw new Error("Owner not found");
      console.log(businessData)

    const business = this.businessRepository.create({ ...businessData, owner });
    return await this.businessRepository.save(business);
  }

  // ✅ Get Business by ID
  async getBusinessById(businessId: string) {
    const business = await this.businessRepository.findOne({ where: { id: businessId }, relations: ["owner"] });
    if (!business) throw new Error("Business not found");
    return business;
  }

  // ✅ List Businesses with Search & Pagination
  async listBusinesses(search: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [businesses, total] = await this.businessRepository.findAndCount({
      where: search ? { name: Like(`%${search}%`) } : {},
      take: limit,
      skip: skip,
      order: { name: "ASC" },
    });

    return {
      businesses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ✅ Update Business
  async updateBusiness(businessId: string, updateData: Partial<Business>) {
    let business = await this.businessRepository.findOne({ where: { id: businessId } });
    if (!business) throw new Error("Business not found");

    Object.assign(business, updateData);
    return await this.businessRepository.save(business);
  }

  // ✅ Delete Business
  async deleteBusiness(businessId: string) {
    const business = await this.businessRepository.findOne({ where: { id: businessId } });
    if (!business) throw new Error("Business not found");

    await this.businessRepository.remove(business);
    return { message: "Business deleted successfully" };
  }
}
