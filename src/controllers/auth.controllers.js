// 1st thing is to check DB if the user exists or not...thsu swe imprt user and it will help us to query anything from the database

import {User} from "../models/user.models.js";
import { ApiResponse} from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js";
import {ApiError} from "../utils/api-error.js";
import {sendEmail} from "../utils/mail.js";

const generateAccessAndRefreshTokens = async(userId)=> {
    try{
        const user=await User.findById(userId)
        const accessToken= user.generateAccessToken();
        const refreshToken= user.generateRefreshToken();

        user.refreshToken= refreshToken// if u see in the modal we have thsi refrehtoken and we can save it here ans av in the db
        await user.save({validateBeforeSave: false});// i dont want all the field validation before save in teh modal

        await sendEmail({  // 
            email: user?.email,// who so u want to send
            subject:"Please verfy your email",// thn we see svbdy in email sent ius options
            mailgenContent:emailVerificationMailgenContent(
                user.username,//it sends 2 thing username and verifictiourl
                `{req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`// now we need to make controller nd routes for tjsi verify-email
// this is a dynamic email...now if u see user has many field in the modals...but no need to send all data so
            )
        });

        //...so
        const createdUser=await User.findById(user._id).select(
            // cotains all those field i dont want now
            "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
        )

        if(!createdUser){// if there is no  content iside createdUser
            throw new ApiError(500, "Something went wrong while user registration")
        }

        return res 
        .status(201)
        .json(
            new ApiResponse(
                200,
                {user:createdUser},
                "User registered successfully and verification email has been sent on your email"
            )
        )

      return {accessToken, refreshToken}// one i m done with saving part


    }
    catch(error){
throw new ApiError(
    500, 
    "Something went wrong while generating acc ess token"
)
    }
}





// ALL STEPS DEPICTING LOGIN WITH COOKIES....
// 1st step how do i accept the dats from frontend..see in postman teh body part of raw in future
const registerUser= asyncHandler(async (req,res)=>{
    const {email,username,password,role}=req.body

    const existedUser= await User.findOne({
        $or: [{username}, {email}]// check if the user exist in dB or nt
    }) 

    if(existedUser){// if user alr exists send error
        throw new ApiError(409," User with email or username already exists", [])
    }

    const user=await User.create({// if the user does not exits add it to the dB
        email, //i want to send some emails to teh user 
        password,
        username,
        isEmailVerified: false// small user is once this oprn is performed this value will be stored in user...thsi user controllers is userSchema based ...
    });



     const {unHashedToken, haskedToken,tokenExpiry}=
     user.generateTemporaryToken(); // calls this method nd run this u will get the things written in ()
})
// how are we accepting the data from frontend?


// step 1 take teh data ....see for cookies and login part

const login= asyncHandler(async(req,res)=>{
    const {email,password,username}= req.body
    if(!email){
        throw new ApiError(400," email is required")// we are assuming tht login can take plave either from email or password anthing
    }
    await User.findOne({email});// we r finding emial based login

    if(!user){
        throw new ApiError(400, "User does not exist")
    }

    const isPasswordValid= await user.isPasswordCorrect(password);

    if(!isPAsswordValid){
        throw new ApiError(400, "Invalid credentials");
    }
    // now see in copy next step if password is correct is to  generate token

   const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id)
   // now we want to send some data...in these process of login user with tokens and cookies
})
  const loggedInUser=await User.findById(user._id).select(
            // cotains all those field i dont want now
            "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
        )// no need to check its exisytehnce as we have already checked for user existence
const options={
    httpOnly: true,
    secure:true
}
// it is for phones
return registerUser.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
    newAResponse(
        200,
        {
user:loggedInUser,
accessToken,
refreshToken
        },
        "User logged in sucessfully"
    )
)// now go to routes and set one
      
export { registerUser };