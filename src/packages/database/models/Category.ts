import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Business } from "./Business";

@Entity("category")
export class Category {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true, length: 100 })
    name: string;

    @ManyToMany(() => Business, (business) => business.categories)
    businesses: Business[];
}
