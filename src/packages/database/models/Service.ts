import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm'
import { Business } from './Business'

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 255, unique: true })
  name: string

  @ManyToMany(() => Business, (business) => business.services)
  businesses: Business[]
}
