import { DataSource } from "typeorm";
import { BlogEntity } from "../entities/blog.entity";
import { CommentsEntity } from "../entities/comments.entity";
import { config } from "dotenv";
import { UserEntity } from "../entities/user.entity";

config()

const appDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    entities: [BlogEntity, CommentsEntity, UserEntity],
})

appDataSource.initialize().then(() => {
}).catch((err) => {
//  throw err
console.error("Database connection error:", err)
})

export default appDataSource;