// 1st thing is to check DB if the user exists or not...thsu swe imprt user and it will help us to query anything from the database

import {User} from "../models/user.models.js";
import { ApiResponse} from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js";
import {ApiError} from "../utils/api-error.js";
import {sendEmail,emailVerificationMailgenContent} from "../utils/mail.js";
import { hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateAccessAndRefreshTokens = async(userId)=> {
    try{
        const user=await User.findById(userId)
        const accessToken= user.generateAccessToken();
        const refreshToken= user.generateRefreshToken();

        user.refreshToken= refreshToken// if u see in the modal we have thsi refrehtoken and we can save it here ans av in the db
        await user.save({validateBeforeSave: false})// i dont want all the field validation before save in teh modal

      return {accessToken, refreshToken}// one i m done with saving part


    }
    catch(error){
throw new ApiError(
    500, 
    "Something went wrong while generating access token"
)
    }
}

   

 






// ALL STEPS DEPICTING LOGIN WITH COOKIES....
// 1st step how do i accept the dats from frontend..see in postman teh body part of raw in future
const registerUser= asyncHandler(async (req,res)=>{
    const {email,username,password,role}=req.body;
      if (!email || !username || !password) {
        throw new ApiError(400, "Email, username and password are required");
    }

    const existedUser= await User.findOne({
        $or: [{username}, {email}]// check if the user exist in dB or nt
    }) 

    if(existedUser){// if user alr exists send error
        throw new ApiError(409," User with email or username already exists", [])
    }

    const user=await User.create({// if the user does not exist add it to the dB
        email, //i want to send some emails to teh user 
        password,
        username,
        isEmailVerified: false// small user is once this oprn is performed this value will be stored in user...thsi user controllers is userSchema based ...
    });



     const {unHashedToken, hashedToken,tokenExpiry}=
     user.generateTemporaryToken(); 
     // calls this method nd run this u will get the things written in ()
user.emailVerificationToken= hashedToken
user.emailVerificationExpiry= tokenExpiry
    await user.save({validateBeforeSave: false})
        await sendEmail({  // 
            email: user?.email,// who so u want to send
            subject:"Please verfy your email",// thn we see svbdy in email sent ius options
            mailgenContent:emailVerificationMailgenContent(
                user.username,//it sends 2 thing username and verifictiourl
                `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`// now we need to make controller nd routes for tjsi verify-email
// this is a dynamic email...now if u see user has many field in the modals...but no need to send all data so
            ),

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
                201,
                {user:createdUser},
                "User registered successfully and verification email has been sent on your email"
            )
        )
});
// how are we accepting the data from frontend?


// step 1 take teh data ....see for cookies and login part

const login= asyncHandler(async(req,res)=>{
    const {email,password}= req.body;
    if(!email){
        throw new ApiError(400," email is required")// we are assuming tht login can take plave either from email or password anthing
    }
    if (!password) {
        throw new ApiError(400, "Password is required");
    }
    const user=await User.findOne({email});// we r finding emial based login

    if(!user){
        throw new ApiError(400, "User does not exist")
    }

    const isPasswordValid= await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(400, "Invalid credentials");
    }
    // now see in copy next step if password is correct is to  generate token

   const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id)
   // now we want to send some data...in these process of login user with tokens and cookies

  const loggedInUser=await User.findById(user._id).select(
            // cotains all those field i dont want now
            "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
        )// no need to check its exisytehnce as we have already checked for user existence
const options={
    httpOnly: true,
    secure:true
}
// it is for phones
return res.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
    new ApiResponse(
        200,
        {
user:loggedInUser,
accessToken,
refreshToken
        },
        "User logged in sucessfully"
    )
);// now go to routes and set one
}); 


const logoutUser= asyncHandler(async(req,res)=>{
await User.findByIdAndUpdate(
    req.user._id,//can aceess all teh req of loggedin user as only he can logout
    {
        $set: {// set changes any value and we make refreshtoken empty
            refreshToken: "",// we know the server has some info so we need to remove it 
        },
    },
    {
        new:true,// once we r doen give me the updated 
    },
);
  const options ={
    httpOnly:true,// for logout we just eed to clear all traces including cookies
    secure:true
  }
return res// we send response where only cookies needs to be removed
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(
    new ApiResponse(200, {}, "User logged out")
)
});

const getCurrentUser= asyncHandler(async (req,res)=>{


    return res
    .status(200)
    .json(
        new ApiResponse(
            200, req.user,"Current User fetched Sucessfully"
        )
    );
});

const verifyEmail=asyncHandler(async (req,res)=>{
    const{verificationToken} = req.params

    if(!verificationToken){
        throw new ApiError(400,"Email Verification token is missing")
    }// we need to have a unhashed token and thn hash it

    let hashedToken=crypto.
    createHash("sha256").
    update(verificationToken)
    .digest("hex")// wiil give the same hTas stored in DBb

const user=await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: {$gt:Date.now()}// we check if the token has not expired as it wont be of any use
})

if(!user){
    throw new ApiError(400,"Token Expired Or Invalid");
}

user.emailVerificationToken=undefined;
user.emailVerificationExpiry=undefined;

user.isEmailVerified=true
await user.save({validateBeforeSave: false })

return res
.status(200)
.json(
    new ApiResponse(
200,{
    isEmailVerified:true, 
}, "Email is verified "
    )
)
});

const resendEmailVerification= asyncHandler(async (req,res)=>{
    const user= await User.findById(req.user?._id);/// alr logged in

    if(!user){
         throw new ApiError(404, "User does not exist")
    }

    if(user.isEmailVerified){
        throw new ApiError(409," Email is already verified")
    }

 const {unHashedToken, hashedToken,tokenExpiry}=
     user.generateTemporaryToken(); 
    
user.emailVerificationToken= hashedToken
user.emailVerificationExpiry= tokenExpiry
    await user.save({validateBeforeSave: false})
    await sendEmail({  
            email: user?.email,
            subject:"Please verfy your email",
            mailgenContent:emailVerificationMailgenContent(
                user.username,
                `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`

        ),
        });
    

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
                "Mail has been resent to your email"
            
        )
    )
});


//browesre sends RT--Verify JWT--find user--comparre refreshtoken with DB --generate new AT--gen new RT --replae old RT IN DB---Ssend both back
const refreshAccessToken= asyncHandler(async (req,res)=>{
const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken

if(!incomingRefreshToken){
    throw new ApiError(401,"Unauthorised access")
}

try{
 const decodedToken= jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
 );

 const user= await User.findById(decodedToken?._id);

 if(!user){
    throw new ApiError(401," Invalid refreshToken");
 }
 if(incomingRefreshToken!==user?.refreshToken){// the token should be in the DB ie expired
    throw new ApiError(401," Refresh Token is Expired");
 }

 const options={
    httpOnly:true,
    secure:true
 }
const {accessToken,refreshToken: newRefreshToken}=await generateAccessAndRefreshTokens(user._id)

user.refreshToken= newRefreshToken;
await user.save()

return res
.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", newRefreshToken, options)
json(new ApiResponse(200,
    {accessToken, refreshToken:newRefreshToken},
    "Access token refreshed"
))

}catch(error){
    throw new ApiError(401," Invalid refresh token");
}
});


const forgotPasswordRequest= asyncHandler (async(req,res)=>{
    const {email}= req.body

    const user =await User.findOne({email})

    if(!user){
        throw new ApiError(404,"User does not exist ",[])
    }

    const {unHashedToken, hashedToken, tokenExpiry}=
    user.generateTemporaryToken();// destructuring it to get wht it has

    user.forgotPasswordToken= hashedToken
    user.forgotPasswordExpiry=tokenExpiry


    await user.save({validateBeforeSave : false})

    await sendEmail({  
            email: user?.email,
            subject:"Password reset request",
            mailgenContent:forgotPasswordMailgenContent(
                user.username,
                `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`

            ),
        });

        return res
        .status(200)
        .json(
            new ApiResponse(200,
            
                {},
                "Password reset mail has been sent on your email "
            )
        )
});

const resetforgotPassword= asyncHandler (async(req,res)=>{
   const {resetToken}= req.params
   const {newPassword}= req.body

   let hashedToken= crypto
   .createHash("sha256")
   .update(resetToken)// wht do we want to updats
. digest ("hex")

const user=await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: {$gt: Date.now()}
})

if(!user){
    throw new ApiError(489,"Token is invalid or expired");
}
user.forgotPasswordExpiry=undefined;
user.forgotPasswordToken= undefined;

user.password=newPassword;// updates the new password
await user.save({validateBeforeSave: false});

return res
.status(200)
.json(new ApiResponse(200,
    {},
    "Password reset successfully!"
))
 
});

const changeCurrentPassword= asyncHandler(async(req,res)=>{
// it is for the logiin user 
const {oldPassword,newPassword}= req.body
const user =await User.findById(req.user?._id)

const isPasswordValid=await user.isPasswordCorrect(oldPassword)

if(!isPasswordValid){
    throw new ApiError(400, " Invalid old password")
}

user.password=newPassword;
await user.save({validateBeforeSave:false})

return res
.status(200)
.json(new ApiResponse(200,
    {},
    " Password Updated"
))
});


export { refreshAccessToken,registerUser,login ,logoutUser, getCurrentUser,verifyEmail,resendEmailVerification,forgotPasswordRequest,resetforgotPassword,changeCurrentPassword};