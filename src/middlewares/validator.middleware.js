import {validationResult} from "express-validator";
import {ApiError} from "../utils/api-error.js ";




export const validate= (req,res,next)=>{
    const errors= validationResult(req);// the validationresult is provided from express-validator
    if(errors.isEmpty()){
        return next();// if there is no error found its good pass it to next 
    }
    const extractedErrors =[];
    errors.array().map((err)=>
    extractedErrors.push({
        [err.path]: err.msg,
        })
    
    );
    throw new ApiError  (422,"Received data is invalid",
        extractedErrors// throw the errors....
    );

}
