// const express = require('express')
import express from "express"
import productsRoutes from './routes/blog'
import commentsRoutes from './routes/comment'
import "reflect-metadata"
import cors  from "cors";

const app = express()
const port = 3000

app.use(cors({
  origin: 'http://localhost:5173', // frontend origin
}));
app.use(express.json())
app.use(express.json());
app.use('/api/blog', productsRoutes)
app.use('/api/comments', commentsRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
