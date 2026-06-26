 import mongoose ,{Schema} from "mongoose";
const projectSchema= new Schema(
    {
   name: {
    type:String,
    required:true,
    uniques:true,
    trim:true,
   },
   desription: {
    type:String
   },
   createdBy:{
    type: Schema.Types.ObjectId,// will provide the details of teh user via another schems using objid
    ref:"User",
    required:true
   }

},
{
    timespan:true
})

export const Project=mongoose.mode("Project",projectSchema);