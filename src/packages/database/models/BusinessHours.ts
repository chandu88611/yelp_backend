import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Business } from "./Business";

@Entity("business_hours")
export class BusinessHours {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Business, { onDelete: "CASCADE" })
    business: Business;

    @Column({ length: 20 })
    day: string;

    @Column({ type: "time" })
    openingTime: string;

    @Column({ type: "time" })
    closingTime: string;
}
