import { ProjectMember } from "../models/projectmember.models.js";
import {User} from "../models/user.models.js";
import {ApiError} from "../utils/api-error.js";
import {asyncHandler} from "../utils/async-handler.js"
import { emailVerificationMailgenContent } from "../utils/mail.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async(req, res,next)=>{
    const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")// oneb way top  grab the token...ie access the accesstoken done by either cookies or auth on postman header

    if(!token){// if no accestoken means user cant request need to register and generate its token
        throw new ApiError(401, "Unauthorised request")
    }

  try{// if we get the token we need to decoe this....since we have access to jwt 
    const decodedToken= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)// pass thsi token and secret token
    const user=await User.findById(decodedToken?._id).select(// fornd the decoded token based on id but ya dont want this
       "  -password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );
    if(!user){
        throw new ApiError(401," Invalid access token")
    }
    req.user=user;
    next(); // append teh request
  }  catch(error){

throw new ApiError(401,"Invalid acess token")
  }
});

// allows only admin to amke changes for example
export const validateProjectPermission=(roles= [])=>{
  asyncHandler(async(req,res,next)=>{
    const {projectId}=req.params;

    if(!projectId)
      throw new ApiError(400,"Projectid is missing");

   const project= await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user._id)
    })
if(!project)
      throw new ApiError(400,"Project is missing");

const givenRole= project?.role
req.user.role=givenRole

if(!roles.includes(givenRole)){ // chexsk if provided rolematches given role
   throw new ApiError(
  403,
"You do not have permission to perform the action")
  }
next()
})
}