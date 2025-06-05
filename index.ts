import express from "express"
import productsRoutes from './routes/blog'
import commentsRoutes from './routes/comment'
import "reflect-metadata"
import cors  from "cors";
import { config } from "dotenv";

config()

const app = express()
const port = 3000

app.use(cors({
  origin: process.env.FRONTEND_URL,
}));
app.use(express.json())
app.use('/api/blog', productsRoutes)
app.use('/api/comments', commentsRoutes)

app.listen(port, () => {
  
})
