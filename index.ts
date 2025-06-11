import express from "express";
import productsRoutes from './routes/blog';
import commentsRoutes from './routes/comment';
import "reflect-metadata";
import cors from "cors";
import { config } from "dotenv";
import session from "express-session";
import userRoute from './routes/user';
import bodyParser from "body-parser";
import passport from "./config/passport";

config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(session({
  secret: "secretKey",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/blog', productsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/auth', userRoute);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}); 
