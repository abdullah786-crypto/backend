import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BlogEntity } from "./blog.entity";

@Entity()
export class CommentsEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    email: string

    @Column()
    comment: string

    @ManyToOne(() => BlogEntity, (blog) => blog.comments)
    @JoinColumn({ name: 'blogId' })
    blogId: BlogEntity

}