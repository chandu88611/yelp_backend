import { Like, ILike } from 'typeorm'
import dataSource from 'ormconfig'
import { Business } from '~/packages/database/models/Business'
import { User } from '~/packages/database/models/User'
import { Photo } from '~/packages/database/models/Photo'
import axios from 'axios'
import * as fs from 'fs'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { Amenity } from '~/packages/database/models/Amenity'
import { In } from 'typeorm' // Make sure this is imported at the top
import { Service } from '~/packages/database/models/Service'
import { Category } from '~/packages/database/models/Category'

export class BusinessService {
  private businessRepository = dataSource.getRepository(Business)
  private amenityRepository = dataSource.getRepository(Amenity)
  private photoRepository = dataSource.getRepository(Photo)
  private userRepository = dataSource.getRepository(User)
  private serviceRepository = dataSource.getRepository(Service) // ✅ Add this
  private categoryRepository = dataSource.getRepository(Category) // ✅ Add this

  // // ✅ Upload Images to GoDaddy Server & Store in Database

  // async uploadBusinessPhotos(businessId: string, userId: string, files: Express.Multer.File[], type: any) {
  //   const business = await this.businessRepository.findOne({ where: { id: businessId }, relations: ['owner'] })
  //   if (!business) throw new Error('Business not found')

  //   const user = await this.userRepository.findOne({ where: { id: userId } })
  //   if (!user) throw new Error('User not found')

  //   const uploadUrls: string[] = []

  //   const imagesDir = path.join(__dirname, '..', '..', 'public', 'images')
  //   if (!fs.existsSync(imagesDir)) {
  //     fs.mkdirSync(imagesDir, { recursive: true })
  //   }

  //   for (const file of files) {
  //     try {
  //       const fileExt = path.extname(file.originalname)
  //       const fileName = `${uuidv4()}${fileExt}`
  //       const filePath = path.join(imagesDir, fileName)
  //       const relativePath = `/images/${fileName}`

  //       fs.writeFileSync(filePath, file.buffer) // Save file locally

  //       const photo = this.photoRepository.create({ business, user, photoUrl: relativePath })
  //       await this.photoRepository.save(photo)

  //       uploadUrls.push(relativePath)
  //     } catch (error) {
  //       console.error(`Error uploading ${file.originalname}:`, error)
  //     }
  //   }

  //   return { success: true, uploadedImages: uploadUrls }
  // }
  async uploadBusinessPhotos(businessId: string, userId: string, files: Express.Multer.File[], type: string) {
    const business = await this.businessRepository.findOne({
      where: { id: businessId },
      relations: ['owner'],
    })

    if (!business) throw new Error('Business not found')

    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) throw new Error('User not found')

    const uploadUrls: string[] = []

    // Directory where the images will be stored
    const imagesDir = path.join(__dirname, '..', '..', 'public', 'images')

    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true })
    }

    // Loop through each file, save locally, and store in the database
    for (const file of files) {
      try {
        const fileExt = path.extname(file.originalname)
        const fileName = `${uuidv4()}${fileExt}`
        const filePath = path.join(imagesDir, fileName)
        // const relativePath = `/images/${fileName}`
        const relativePath = `/images/${fileName}`

        // Save the file locally
        fs.writeFileSync(filePath, file.buffer)

        // Create a new photo record, including the 'type' of gallery
        const photo = this.photoRepository.create({
          business,
          user,
          photoUrl: relativePath,
          type, // Add 'type' to associate with the photo
        })

        await this.photoRepository.save(photo)

        // Add the relative path to the upload URLs array
        uploadUrls.push(relativePath)
      } catch (error) {
        console.error(`Error uploading ${file.originalname}:`, error)
      }
    }

    // Return the response with the uploaded image URLs
    return { success: true, uploadedImages: uploadUrls }
  }

  // ✅ Delete Business Photo (Admin-only, no userId needed)
  async deleteBusinessPhoto(businessId: string, photoId: string) {
    // Check if the business exists
    const business = await this.businessRepository.findOne({ where: { id: businessId } })
    if (!business) throw new Error('Business not found')

    // Find the photo by ID and ensure it belongs to the business
    const photo = await this.photoRepository.findOne({ where: { id: photoId }, relations: ['business'] })
    if (!photo) throw new Error('Photo not found')
    if (photo.business.id !== business.id) {
      throw new Error('This photo does not belong to the business')
    }

    // Delete the physical photo file if it exists
    const filePath = path.join(__dirname, '..', '..', 'public', photo.photoUrl)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    // Delete the photo from the database
    await this.photoRepository.delete(photoId)

    return { success: true, message: 'Photo deleted successfully' }
  }

  // ✅ Update Business Basic Details
  // async updateBusinessDetails(businessId: string, updateData: Partial<Business>) {
  //   const business = await this.businessRepository.findOne({ where: { id: businessId } })
  //   if (!business) throw new Error('Business not found')

  //   Object.assign(business, updateData)
  //   return await this.businessRepository.save(business)
  // }
  async updateBusinessDetails(
    businessId: string,
    updateData: Partial<Business> & { services?: string[]; amenities?: string[] },
  ) {
    const business = await this.businessRepository.findOne({
      where: { id: businessId },
      relations: ['services', 'amenities'],
    })

    if (!business) throw new Error('Business not found')

    // Handle services
    if (updateData.services) {
      const services = await this.serviceRepository.findBy({
        id: In(updateData.services),
      })
      business.services = services
    }

    // Handle amenities
    if (updateData.amenities) {
      const amenities = await this.amenityRepository.findBy({
        id: In(updateData.amenities),
      })
      business.amenities = amenities
    }

    // Avoid assigning services and amenities again
    const {
      services: _services, // discard
      amenities: _amenities, // discard
      ...otherFields
    } = updateData

    Object.assign(business, otherFields)

    return await this.businessRepository.save(business)
  }

  // ✅ Create a New Business
  async createBusiness(
    businessData: Partial<Business> & { ownerId: string; services?: string[]; amenities?: string[] },
  ) {
    const owner = await this.userRepository.findOne({ where: { id: businessData.ownerId } })
    if (!owner) throw new Error('Owner not found')

    const amenities =
      businessData.amenities && businessData.amenities.length > 0
        ? await this.amenityRepository.findBy({ id: In(businessData.amenities) })
        : []

    const services =
      businessData.services && businessData.services.length > 0
        ? await this.serviceRepository.findBy({ id: In(businessData.services) })
        : []

    let businessType = null
    if (businessData.businessType) {
      // Find the category and save its ID
      const category = await this.categoryRepository.findOne({
        where: { id: businessData.businessType }, // businessData.businessType will be a string (category id)
      })
      if (!category) throw new Error('Invalid business type')

      // Save only the ID of the Category, not the whole object
      businessType = category.id
    }

    const business = this.businessRepository.create({
      ...businessData,
      owner,
      amenities,
      services,
      businessType, // businessType will now be just the category ID (string)
    })

    return await this.businessRepository.save(business)
  }

  // ✅ Get Business by ID
  async getBusinessById(businessId: string) {
    const business = await this.businessRepository.findOne({
      where: { id: businessId },
      relations: ['amenities', 'galleries', 'services'],
    })

    if (!business) throw new Error('Business not found')
    return business
  }

  // ✅ Get Businesses with Search and Pagination
  async getBusinesses(page = 1, limit = 10, search = ''): Promise<{ data: Business[]; total: number }> {
    const [data, total] = await this.businessRepository.findAndCount({
      where: [
        { businessName: ILike(`%${search}%`) },
        { city: ILike(`%${search}%`) },
        { description: ILike(`%${search}%`) },
      ],
      relations: ['owner', 'amenities', 'categories', 'galleries', 'services'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })
    return { data, total }
  }

  // ✅ Get Latest 10 Businesses (ordered by createdAt and updatedAt DESC)

  async getLatestBusinesses(): Promise<Business[]> {
    const latestBusinesses = await this.businessRepository.find({
      relations: ['owner', 'amenities', 'categories', 'galleries', 'services'],
      order: {
        updatedAt: 'DESC',
        createdAt: 'DESC',
      },
      take: 10,
    })

    return latestBusinesses
  }

  // In businessService.ts

  // ✅ Get Businesses By Category
  async getBusinessesByCategory(category: string): Promise<Business[]> {
    const whereClause = category ? { businessType: category } : {} // Filters by businessType

    const businesses = await this.businessRepository.find({
      where: whereClause,
      relations: ['owner', 'amenities', 'categories', 'galleries', 'services'], // Include relations
      order: { createdAt: 'DESC' },
    })
    return businesses
  }

  // ✅ Delete Business
  async deleteBusiness(businessId: string) {
    const business = await this.businessRepository.findOne({ where: { id: businessId } })
    if (!business) throw new Error('Business not found')

    await this.businessRepository.remove(business)
    return { success: true, message: 'Business deleted successfully' }
  }
}
