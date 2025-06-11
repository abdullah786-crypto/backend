import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommentsEntity } from "./comments.entity";
import { UserEntity } from "./user.entity";

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

    @ManyToOne(() => UserEntity, (usr) => usr.post)
    @JoinColumn({name: 'userId'})
    user: UserEntity

    @OneToMany(() => CommentsEntity, (com) => com.blogId)
    comments: CommentsEntity[]

}