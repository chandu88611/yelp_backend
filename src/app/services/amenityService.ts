import dataSource from "ormconfig";
import { ILike, In } from "typeorm";
import { Amenity } from "~/packages/database/models/Amenity";

 

export class AmenityService {
  private amenityRepository = dataSource.getRepository(Amenity);

  async createAmenity(name: string): Promise<Amenity> {
    const existingAmenity = await this.amenityRepository.findOne({ where: { name } });
    if (existingAmenity) {
      throw new Error("Amenity already exists.");
    }

    const newAmenity = this.amenityRepository.create({ name });
    return await this.amenityRepository.save(newAmenity);
  }
  async getAmenitiesByIds(amenityIds: string[]) {
    if (!amenityIds || amenityIds.length === 0) return [];

  
    const amenities = await this.amenityRepository.findBy({ id: In(amenityIds) });

    return amenities;
  }
  async getAllAmenities(search: string = "", page: number = 1, limit: number = 10): Promise<{ data: Amenity[]; total: number }> {
    const [data, total] = await this.amenityRepository.findAndCount({
      where: search ? { name: ILike(`%${search}%`) } : {},
      skip: (page - 1) * limit,
      take: limit,
    });
  
    return { data, total };
  }


  async updateAmenity(id: string, name: string): Promise<Amenity> {
    const amenity = await this.amenityRepository.findOne({ where: { id } });
    if (!amenity) {
      throw new Error("Amenity not found.");
    }

    amenity.name = name;
    return await this.amenityRepository.save(amenity);
  }
  async deleteAmenity(id: string): Promise<void> {
    await this.amenityRepository.delete(id);
  }
}
