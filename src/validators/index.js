import {body} from "express-validator";

const userRegisterValidator=()=>{
  return [
    body("email")// i want to put validation for email for now
        .trim()
        .notEmpty()//checks or validate if it is empty and if yes sends the follow message
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
  body("username")
  .trim()
  .notEmpty()//checks or validate if it is empty and if yes sends the follow message
        .withMessage("Username is required")
        .isLowercase()
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

const userLoginValidator=()=>{
    return[  
    body("email")
          .trim()
        .notEmpty()//checks or validate if it is empty and if yes sends the follow message
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
        
    ]
}

const userChangeCurrentPasswordValidator= ()=>{
  return[
    body("oldPassword")
    .notEmpty()
    .withMessage("Old password is required"),

      body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
  ]
};

const userForgotPasswordValidator
=()=>{
  return[
      body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
  . withMessage("Email is invalid")

];
};


const userResetForgotPasswordValidator=()=>{
    return [  body("newPassword")
    .notEmpty()
    .withMessage("Password is required")];
};
export {
userForgotPasswordValidator,
 userChangeCurrentPasswordValidator,
  userRegisterValidator  ,userLoginValidator,userResetForgotPasswordValidator,
}