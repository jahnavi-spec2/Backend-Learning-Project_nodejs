import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema= new Schema(
   {

     avatar: {
         type:{
           url: String,
           localPath:String 
         },
         default:{
            url:`https://placehold.co/200x200`,
            localPath:""
         },
      },
         username:{
          type: String,
          required:true,
          unique:true,
          lowercase: true,
          trim:true,
          index: true
         },
         email:{
            type:String,
            required: true,
            unique:true,
            lowercase:true,
            trim:true
         },
         fullName: {
            type: String,
            trim:true,
         },
         password:{
            type:String,
            required:[true, "Password is required"]
         },
         isEmailVerified:{
            type:Boolean,
            default: false
         },
         refreshToken: {
            type:String
         },
         forgotPasswordToken: {
            type: String
         },
         forgotPasswordExpiry:{
            type:Date
         },
         emailVerificationExpiry:{
            type:Date
         },
      },
{ 
     timestamps: true
     
});

// i want tpoo attach pre hook toh this schema and thn on applying save fnc ...we will use it thn call or pass to next hook 
userSchema.pre("save", async function(next){

   if (!this.isModified("password")) return next ();// if this is not getting modified i will return next...i mean iwont do anything
   this.password=await bcrypt.hash(this.password, 10);// wht data i want to have and how many rounds ineed to hash 
   //  once i m done i moove on next bt note we dont save...
});

userSchema.methods.isPasswordCorrect= async function(password){
 return await bcrypt.compare(password,this.password)  
};// a userschema method attacjhed to it used to verify the hash alue onternaluy of teh password enterd and current one


// THIS IS HOW WE GENERATE ACCESS AND REFRESH TOKEN ...BHERY EASY
userSchema.methods.generateAccessToken =function() {

  return jwt.sign(
   {
      _id:this._id,// THSI IS TEH PAYLOAD PART 
      email: this.email,// u eant to storee email ig..this all info is payload...thn provide the secret
      username:this.username
   },
   process.env.ACCESS_TOKEN_SECRET,// given the secrer
   {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
   }

   )

}

// DOES NOT ALWAYS BE THSI LONG AS ACCESSS 
userSchema.methods.generateRefreshToken =function() {
  return jwt.sign(
   {
      _id:this._id,// provie the payload
      email: this.email,
      username:this.username
   },
   process.env.REFRESH_TOKEN_SECRET,// provide the secret
   {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}

   );
}
// GENERATE TOKEN WITH DATA ...for this we use crypto module in node js...for which we use hash map

userSchema.methods.generateTemporaryToken= function (){// used for verifying the use or for password reset
   const unhashedToken = crypto.randomBytes(20).toString("hex") // provide random bytes thn covert to string
// and crypto generally provides hex value

//ENCRYPTING THE INFO
   const hashedToken= crypto// whtever is generated 
   .createHash("eudba23")//name of algo we want to use inside bracket
   .update(unhashedToken)// which uwant to hash
   .digest("hex")
   // we need to pass this token nd give some expiry...whenver we use to send this method in any controller...it will return us teh data
   //and in tht cotroller we r going to store these info...in those fields see in modals folder tht emailverification d all

   const tokenExpiry= Date.now()+ (20*60*1000)// 20 min
   return {unhashedToken,hashedToken,tokenExpiry}// it will return to any user calling it ie the fnc
};

export const User=mongoose.model("User", userSchema)