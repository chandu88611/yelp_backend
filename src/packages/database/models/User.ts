import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Business } from "./Business";
import { Review } from "./Review";
import { Photo } from "./Photo";
 
// export enum UserRole {
//     USER = "user",
//     BUSINESS_OWNER = "business_owner",
//     ADMIN = "admin",
//   }

@Entity('users')
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 100 })
    fullName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column({ nullable: true })
    profileImage: string;

    @CreateDateColumn()
    joinDate: Date;

    @Column({ type: "enum", enum: ["user", "business_owner", "admin"], default: "user" })
    role: string;

    @OneToMany(() => Business, (business) => business.owner)
    businesses: Business[];

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];

    @OneToMany(() => Photo, (photo) => photo.user)
    photos: Photo[];
}
