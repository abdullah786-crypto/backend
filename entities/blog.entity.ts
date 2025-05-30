import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommentsEntity } from "./comments.entity";

@Entity()
export class BlogEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    subtitle: string

    @Column()
    image: string

    @Column('longtext')
    blogData: string

    @OneToMany(() => CommentsEntity, (com) => com.blogId)
    comments: CommentsEntity[]

}