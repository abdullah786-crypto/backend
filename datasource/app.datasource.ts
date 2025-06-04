import { DataSource } from "typeorm";
import { BlogEntity } from "../entities/blog.entity";
import { CommentsEntity } from "../entities/comments.entity";

const appDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'asdfzxcv',
    database: 'blog_app',
    synchronize: true,
    entities: [BlogEntity, CommentsEntity],
})

appDataSource.initialize().then(() => {
        console.log("Data Source has been initialized!")
}).catch((err) => {
        console.log("Error during Data Source initialization", err)

})

export default appDataSource;