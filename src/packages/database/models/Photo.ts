import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm'
import { Business } from './Business'
import { User } from './User'

@Entity('photo')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  type: string

  @ManyToOne(() => Business, (business) => business.galleries, { onDelete: 'CASCADE' })
  business: Business

  @ManyToOne(() => User, (user) => user.photos, { onDelete: 'CASCADE' })
  user: User

  @Column()
  photoUrl: string

  @CreateDateColumn()
  uploadedAt: Date
}
