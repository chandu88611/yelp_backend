import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Business } from "./Business";

@Entity("service")
export class Service {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 255 })
    name: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @ManyToMany(() => Business, (business) => business.services)
    businesses: Business[];
}
