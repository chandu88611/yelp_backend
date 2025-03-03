import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";
import { Review } from "./Review";
import { Photo } from "./Photo";
import { Category } from "./Category";
import { Service } from "./Service";
 

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

    @Column({ type: "text" })
    address: string;

    @Column({ length: 100 })
    city: string;

    @Column({ length: 100 })
    state: string;

    @Column({ nullable: true })
    zipCode: string;

    @Column({ length: 50 })
    country: string;

    @Column({ type: "decimal", precision: 9, scale: 6, nullable: true })
    latitude: number;

    @Column({ type: "decimal", precision: 9, scale: 6, nullable: true })
    longitude: number;

    @Column({ nullable: true })
    googleMapsUrl: string;

    @Column({ type: "time" })
    openingTime: string;

    @Column({ type: "time" })
    closingTime: string;

    @Column({ nullable: true })
    facebookUrl: string;

    @Column({ nullable: true })
    instagramUrl: string;

    @Column({ nullable: true })
    twitterUrl: string;

    @Column({ nullable: true })
    linkedinUrl: string;

    @Column({ length: 255, nullable: true })
    ownerName: string;

    @Column({ nullable: true })
    ownerContact: string;

    @Column({ type: "text", nullable: true })
    additionalInfo: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Review, (review) => review.business)
    reviews: Review[];

    @OneToMany(() => Photo, (photo) => photo.business)
    photos: Photo[];

    @ManyToMany(() => Category)
    @JoinTable()
    categories: Category[];

    @ManyToMany(() => Service)
    @JoinTable()
    services: Service[];
}
