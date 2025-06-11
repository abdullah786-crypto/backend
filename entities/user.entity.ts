import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: any

    @Column({unique: true})
    username: string

    @Column()
    password: string

}