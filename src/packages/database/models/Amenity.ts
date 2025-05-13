import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Business } from "./Business";

@Entity("amenities")
export class Amenity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255, unique: true })
  name: string;

  @ManyToMany(() => Business, (business) => business.amenities)
  businesses: Business[];
}
 