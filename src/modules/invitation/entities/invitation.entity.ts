import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Entity,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity("invitation")
export class Invitation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  guestName: string;

  @Column()
  dateOfEntry: Date;

  @Column()
  expirationDate: Date;

  @Column({
    nullable: true,
  })
  tokenShare: string;

  @ManyToOne(() => User, (client) => client.invitation)
  @JoinTable({ name: "userId" })
  public user!: User;
  @Column()
  userId: number;
}
