import { 
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, 
    ManyToOne, OneToMany, ManyToMany, JoinTable 
} from "typeorm";
import { User } from "./User";
import { Review } from "./Review";
import { Photo } from "./Photo";
import { Category } from "./Category";
import { Service } from "./Service";
import { Amenity } from "./Amenity";

@Entity('businesses')
export class Business {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.businesses, { onDelete: "CASCADE" })
    owner: User;

    @Column({ length: 255 })
    name: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    website: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    zipCode: string;

    @Column({ nullable: true })
    googleMapUrl: string;

    @Column({ nullable: true })
    socialLinks: string; // Store as JSON string (Facebook, Instagram, etc.)

    @Column({ type: "simple-array", nullable: true })
    operatingHours: string[]; // Example: ["Mon-Sat: 10AM-7PM", "Sun: 11AM-5PM"]

    @ManyToMany(() => Service, { cascade: true })
    @JoinTable()
    services: Service[];
  
    @ManyToMany(() => Amenity, { cascade: true })
    @JoinTable()
    amenities: Amenity[]; 

    @ManyToMany(() => Category, { cascade: true })
    @JoinTable()
    categories: Category[];

 // Example: ["Free WiFi", "Complimentary Beverages"]

    @Column({ nullable: true })
    specialOffers: string; // Example: "10% discount for first-time customers"

    @Column({ nullable: true })
    bookingUrl: string; // Link to booking page

    @OneToMany(() => Review, (review) => review.business, { cascade: true })
    reviews: Review[];

    @Column({ type: "float", default: 0 })
    averageRating: number;

    @Column({ type: "int", default: 0 })
    reviewCount: number;

    @OneToMany(() => Photo, (photo) => photo.business, { cascade: true })
    photos: Photo[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
