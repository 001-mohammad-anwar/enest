import express from "express";
import { config } from "dotenv";
config();

import cors from "cors"
import cookieParser from "cookie-parser";
import authrouter from "./router/auth-router.js"
import projectRouter from "./router/project.route.js"
import taskRoutes from "./router/task.route.js"



const app = express();

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.get("/ping", (req,res) => {
  try {
      res.status(200).json({
        message: "Server is awake"
      })
  } catch (error) {
    console.log("error from ping", error)
  }
})


app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:true}));

app.use("/api/auth" , authrouter)
app.use("/api/project" , projectRouter)
app.use("/api/task", taskRoutes);


export default app;