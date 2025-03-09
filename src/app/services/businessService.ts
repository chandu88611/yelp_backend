import { Like } from "typeorm";
import dataSource from "ormconfig";
import { Business } from "~/packages/database/models/Business";
import { User } from "~/packages/database/models/User";

export class BusinessService {
  private businessRepository = dataSource.getRepository(Business);

  // ✅ Create a New Business
  async createBusiness(ownerId: string, businessData: Partial<Business>) {
    const owner = await dataSource.getRepository(User).findOne({ where: { id: ownerId } });
    if (!owner) throw new Error("Owner not found");

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
