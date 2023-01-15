import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
  JoinTable,
} from "typeorm";
import { Invitation } from "../../invitation/entities/invitation.entity";

@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  departmentNumber: string;

  @Column({
    nullable: true,
  })
  tokenPassword: string;

  @OneToMany(() => Invitation, (invitation) => invitation.userId)
  @JoinTable()
  invitation: Invitation[];
}
