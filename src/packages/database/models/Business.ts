import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { User } from './User'
import { Review } from './Review'
import { Photo } from './Photo'
import { Category } from './Category'
import { Service } from './Service'
import { Amenity } from './Amenity'

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.businesses, { onDelete: 'CASCADE' })
  owner: User

  // Business Basic Information
  @Column({ length: 255 })
  businessName: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ nullable: true })
  website: string

  @Column({ nullable: true })
  establishedYear: string

  @Column({ nullable: true })
  employeeCount: string

  @Column({ nullable: true })
  businessType: string // Nullable if not defined

  @Column('simple-array', { nullable: true })
  services: string[]

  @Column({ type: 'text', nullable: true })
  overview: string

  // Logo and gallery fields
  @Column({ nullable: true })
  logoUid: string // Reference to the logo's UID

  @Column({ nullable: true })
  logoAltText: string

  @OneToMany(() => Photo, (photo) => photo.business, { cascade: true })
  galleries: Photo[] // Store multiple images in a gallery format

  // Address Information
  @Column({ nullable: true })
  address1: string

  @Column({ nullable: true })
  address2: string

  @Column({ nullable: true })
  city: string

  @Column({ nullable: true })
  state: string

  @Column({ nullable: true })
  zip: string

  @Column({ nullable: true })
  country: string

  @Column({ nullable: true })
  latitude: string

  @Column({ nullable: true })
  longitude: string

  @Column({ nullable: true })
  googleMapUrl: string

  @Column({ nullable: true })
  landmark: string

  // Contact Information
  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  altEmail: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  altPhone: string

  @Column({ nullable: true })
  whatsapp: string

  // Operating hours for each day (could be adjusted to match the exact structure)
  @Column({ type: 'json', nullable: true })
  operatingHours: Record<string, { open: string | null; close: string | null }> = {}

  // Holiday information (adjust to the right format)
  @Column({ type: 'json', nullable: true })
  holiday: { start: string | null; end: string | null }

  // SEO and Social Media Information
  @Column({ nullable: true })
  metaTitle: string

  @Column({ nullable: true })
  metaDescription: string

  @Column({ nullable: true })
  keywords: string

  @Column({ nullable: true })
  canonicalUrl: string

  @Column({ nullable: true })
  imageAltText: string

  @Column({ nullable: true })
  socialMediaTitle: string

  @Column({ nullable: true })
  socialMediaDescription: string

  @Column({ nullable: true })
  facebookTitle: string

  @Column({ nullable: true })
  twitterTitle: string

  @Column({ nullable: true })
  googleAnalyticsId: string

  @Column({ nullable: true })
  slug: string

  // Reviews and Ratings
  @OneToMany(() => Review, (review) => review.business, { cascade: true })
  reviews: Review[]

  @Column({ type: 'float', default: 0 })
  averageRating: number

  @Column({ type: 'int', default: 0 })
  reviewCount: number

  @ManyToMany(() => Service, { cascade: true })
  @JoinTable()
  servicesList: Service[]

  @ManyToMany(() => Amenity, { cascade: true })
  @JoinTable()
  amenities: Amenity[]

  @ManyToMany(() => Category, { cascade: true })
  @JoinTable()
  categories: Category[]

  @Column({ nullable: true })
  specialOffers: string // Example: "10% discount for first-time customers"

  @Column({ nullable: true })
  bookingUrl: string // Link to booking page

  // Creation and Update timestamps
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
