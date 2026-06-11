import dotenv from "dotenv";
import app from "./app.js";
// import express from "express";
import connectDB from "./db/index.js"

dotenv.config({
    path : "./.env",
});


// let myusername = process.env.My_Username;
//  console.log("value: ", myusername);

// console.log("Start of an awesome project");
// // some people like the use of require and some import...go in .json and make change in module...with name 'type'....can make this change anywhere
// //use type='common js' if want require ....and 'module' if want import


// Express.....

// const app= express();
// const port =3000;
// // if u declare liek thsi its not a good idea...instead go to env and decleare a var PoRT
const port =process.env.PORT || 3000;
// app.get("/", (req,res)=>{
//     res.send("HelloWorld!!");
// });

// app.get("/instagram", (req,res)=>{
//     res.send("this is an instagram page");
// })


//  app.listen(port,() =>{
//     console.log(`Example app listening on port http://localhost:${port}`);
//  });

connectDB()// if the bd is connected thn only i want my app.js to listen
.then(()=>{
    app.listen(port, ()=>{
        console.log(`Example app listening on port http://localhost:${port}`);
    })
})
.catch((err)=> {
    console.error("MongoDB Connection error", err)
    process.exit(1)
     
})
