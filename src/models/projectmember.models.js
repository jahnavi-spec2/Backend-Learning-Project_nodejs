import mongoose ,{Schema} from "mongoose";
// it is abt those members who r working on teh project
import {AvailableUserRole, UserRolesEnum} from "../utils/constants.js"
const projectmenberSchema= new Schema({
user: {
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
},
project:
{
  type:Schema.Types.ObjectId,
    ref:"Project",
    required:true
},
role:{
    type:String,
    enum:AvailabelUserRole,// 
    default:UserRolesEnum.MEMBER// a default role you r teh default emmber
}
},{timestamps:true})

export const ProjectMember=mongoose.mode("ProjectMember",projectmemberSchema);