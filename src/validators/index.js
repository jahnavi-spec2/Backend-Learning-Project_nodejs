import {body} from "express-validator";

const userRegisterValidator=()=>{
  return [
    body("email ")// i want to put validation for email for now
        .trim()
        .notEmpty()//checks or validate if it is empty and if yes sends the follow message
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
  body("username")
  .trim()
  .notEmpty()//checks or validate if it is empty and if yes sends the follow message
        .withMessage("EUsername is required")
        .isLowerCase()
        .withMessage("Username must be in lower case")
        .isLength({min: 3})
        .withMessage("Username must be atleast 3 characters long"),
     body("password")
     .trim()
     .notEmpty()
     .withMessage("Password is required")   ,
 body("fullName")
 .optional()
 .trim()// if u want to validate more items or add more conditions fell free
  ]
}

export {
  userRegisterValidator  
}