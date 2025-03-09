import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from "typeorm";
import { Business } from "./Business";

@Entity('services')
export class Service {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Business, (business) => business.services, { onDelete: "CASCADE" })
    business: Business;

    @Column({ length: 255 })
    name: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ type: "float", nullable: true })
    price: number;
}
