import dataSource from 'ormconfig'
import { ILike, In } from 'typeorm'
import { Service } from '~/packages/database/models/Service'

export class ServiceService {
  private serviceRepository = dataSource.getRepository(Service)

  async createService(name: string): Promise<Service> {
    const existingService = await this.serviceRepository.findOne({ where: { name } })
    if (existingService) {
      throw new Error('Service already exists.')
    }

    const newService = this.serviceRepository.create({ name })
    return await this.serviceRepository.save(newService)
  }

  async getServicesByIds(serviceIds: string[]) {
    if (!serviceIds || serviceIds.length === 0) return []

    const services = await this.serviceRepository.findBy({ id: In(serviceIds) })
    return services
  }

  async getAllServices(
    search: string = '',
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Service[]; total: number }> {
    const [data, total] = await this.serviceRepository.findAndCount({
      where: search ? { name: ILike(`%${search}%`) } : {},
      skip: (page - 1) * limit,
      take: limit,
    })
    return { data, total }
  }

  async deleteService(id: string): Promise<void> {
    await this.serviceRepository.delete(id)
  }
  async updateService(id: string, name: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({ where: { id } })
    if (!service) {
      throw new Error('Service not found.')
    }

    service.name = name
    return await this.serviceRepository.save(service)
  }
}
