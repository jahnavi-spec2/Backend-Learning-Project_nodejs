import express from "express";
import cors from "cors";

const app= express();
// basic configuration
app.use(express.json({limit:" 16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}));
app.use(express.static("public"));// nME OF FOLDER WHERE STATIC IS ...IS PUBLIC

//cors configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",")|| "http://localhost:5173",
    credentials:true,
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders:["Content-Type","Authorisation"],
}))
app.get("/",(req,res)=>{
res.send("Welcome Home");
});

export default app;