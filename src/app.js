import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app= express();
// basic configuration
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}));
app.use(express.static("public"));// nME OF FOLDER WHERE STATIC IS ...IS PUBLIC
app.use(cookieParser())

//cors configuration 
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",")|| "http://localhost:5173",
    credentials:true,
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders:["Content-Type","Authorization"],
}))


// import the routes
 import healthCheckRouter from "./routes/healthCheck.routes.js";
 import authRouter from "./routes/auth.routes.js"
 import projectRouter from "./routes/project.routes.js"

 app.use("/api/v1/healthcheck", healthCheckRouter); // thsin api part is considereda s hoem route thn add anything later to it
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);


app.get("/",(req,res)=>{
res.send("Welcome Home");
});

export default app;