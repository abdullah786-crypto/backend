import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BlogEntity } from "./blog.entity";

@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: any

    @Column({unique: true})
    username: string

    @Column()
    password: string

    @OneToMany(() => BlogEntity, (blog) => blog.user)
    post: BlogEntity[]

}