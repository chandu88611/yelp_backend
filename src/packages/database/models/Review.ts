import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Business } from "./Business";

@Entity("review")
export class Review {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.reviews, { onDelete: "CASCADE" })
    user: User;

    @ManyToOne(() => Business, (business) => business.reviews, { onDelete: "CASCADE" })
    business: Business;

    @Column({ type: "decimal", precision: 2, scale: 1 })
    rating: number;

    @Column({ type: "text" })
    reviewText: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
