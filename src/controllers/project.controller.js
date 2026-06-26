import {User} from "../models/user.models.js";
import {Project} from "../models/project.models.js";
import {ProjectMember} from "../models/projectmember.models.js";
import { ApiResponse} from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js";
import {ApiError} from "../utils/api-error.js";
import mongoose from "mongoose";




const getProject= asyncHandler(async(req,res)=>{

});



const getProjectById= asyncHandler(async(req,res)=>{

});



const createProject= asyncHandler(async(req,res)=>{
const {name,description}=req.body

await Project.create({
    name,
    description,
    createdBy: new mongoose.Types.ObjectId(req.user._id)
});
    // whoever is creating the project must be made admin

    await ProjectMember.create({
        user: new mongoose.Types.ObjectId(req.user._id),
        project: new mongoose.Types.ObjectId(project._id),
        role: UserRolesEnum.ADMIN
    })

    return res.status(201)
    .json(
        new ApiResponse(201,
            project,
            "Project created successfully"
        )
    )

});
const updateProject= asyncHandler(async(req,res)=>{
// maybe one wnats to update name or description  
const {name,description}=req.body
const {projectId} = req.params

const project=await Project.findByIdAndUpdate(
    projectId,{name,description},
    {new:true},// stored the details u want to update nad ahve found in db
)

if(!project){
   throw new ApiError(404, "Project not Found") 
}

return req.status(200).json(new ApiResponse(200, project, "project updated successfully"));
});

const deleteProject= asyncHandler(async(req,res)=>{
   const {ProjectId}=body.params

   const project= await Project.findByIdAndDelete(projectId)
if(!project){

       throw new ApiError(404, "Project not Found") 

}
return req.status(200).json(new ApiResponse(200, project, "Project deleted successfully"));
});



const addMembersToProject= asyncHandler(async(req,res)=>{

});

const deleteMembersToProject= asyncHandler(async(req,res)=>{

});



const getProjectMembers= asyncHandler(async(req,res)=>{

});

export {getProjectMembers,addMembersToProject,deleteProject,updateProject,createProject,getProjectById,getProject,deleteMembersToProject}; 