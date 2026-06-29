import {User} from "../models/user.models.js";
import {Project} from "../models/project.models.js";
import {ProjectMember} from "../models/projectmember.models.js";
import { ApiResponse} from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js";
import {ApiError} from "../utils/api-error.js";
import mongoose from "mongoose";
import { AvailableUserRole ,UserRolesEnums} from "../utils/constants.js";


// getProject are different ...tehy are the list of projects amde a some user who wish toh get it by id

const getProject= asyncHandler(async(req,res)=>{
const projectList =await ProjectMember.aggregate(
 [
    {
        $match: {// aggregation pipeline
            user: new mongoose.Types.ObjectId(req.user._id),
        }
    },
    {
        $lookup:{
            from:"projectList",// from where r u going to look into the prjects 
            localField:"projectList",
            foreignField: "_id",
            as: "projects",// wht do u want to call it
        pipeline: [
            {
                $lookup:{
                    from:"projectmembers",
                    localField:"_id",
                    foreignField:"projects",
                    as:"projectmembers"
                },
            },
            {
                $addFields:{
                    members:{// calculate teh no of members in the prject contribution
                        $size: "$projectmembers",
                    }
                }
            },
        ]
        
        }
    },
    {
        $unwind: "$project"
    },
    {
        $project:{
            project:{
                _id: 1,
                name:1,
                description:1,
                members:1,
                createdAt:1,
                createdBy: 1
            },
            role: 1,
            _id:0
        }
    }
]
)

return res.status(200).json(new ApiResponse(200, projectList,"Projects fetched successfully"))
});



const getProjectById= asyncHandler(async(req,res)=>{// whichh project r u loking up for
const {projectId}=req.params
    const project= await Project.findById(projectId)

    if(!project){
        throw new ApiError(404, "Project not found");
    }

    return res.status(200).json(new ApiResponse(200, project,"Project fetched successfully"))


});



const createProject= asyncHandler(async(req,res)=>{
const {name,description}=req.body

const project =await Project.create({// check 
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

   const project= await Project.findByIdAndDelete(projectId)// check
if(!project){

       throw new ApiError(404, "Project not Found") 

}
return req.status(200).json(new ApiResponse(200, project, "Project deleted successfully"));
});



const addMembersToProject= asyncHandler(async(req,res)=>{
     const {email,role}= req.body
     const {projectId}= req.params
     const user= await User.findOne({email})
     
     if(!user){
        throw new ApiError(404, "User does not exist")
     }

     await ProjectMember.findByIdAndUpdate({
        // based on 2 things we wan to find 
        //user:user_id
        user: new mongoose.Types.ObjectId(user._id),// find teh project based on id
        project: new mongoose.Types.ObjectId(projectId)
     },
    
    {
 
// updating the role of teh newly added member 
            user: new mongoose.Types.ObjectId(user._id),// find teh project based on id
            project: new mongoose.Types.ObjectId(projectId),
            role: role
    },
{
    new:true,// return updated doc
    upsert:true// creates a new projec and whoel doc if none of them exist
})
return req.status(200).json(new ApiResponse(200, {}, "Project member added successfully"));


});

const deleteMember= asyncHandler(async(req,res)=>{
const {projectId,userId}= req.params
    
    
    let projectMember= await ProjectMember.findOne({
         project: new mongoose.Types.ObjectId(projectId),
         user: new mongoose.Types.ObjectId(userId)
    })

    if(!projectMember)
        throw new ApiError(400, "Project member not found");

    let projectMember= await ProjectMember.findByIdAndDelete(
        projectMember._id,
    )

       
    return res.status(200).json(new ApiResponse(200,projectMember, "Project Member deleted "))
});
const updateMemberRole= asyncHandler(async(req,res)=>{// give me new role...so i need projectid and user

    const {projectId,userId}= req.params
    const {newRole}=req.body

    if(!AvailableUserRole.includes(newRole))
        throw ApiError(400, "Invalid Role")

    let projectMember= await ProjectMember.findOne({
         project: new mongoose.Types.ObjectId(projectId),
         user: new mongoose.Types.ObjectId(userId)
    })

    if(!projectMember)
        throw new ApiError(400, "Project member not found");

    let updatedprojectMember= await ProjectMember.findByIdAndUpdate(
        projectMember._id,
        {
            role:newRole
        },
        {
            new:true// gives updated doc
        }
    )
if(!updatedprojectMember)
        throw new ApiError(400, "Project member not found");

    return res.status(200).json(new ApiResponse(200, updatedprojectMember, "Role Updated"))
});


const getProjectMembers= asyncHandler(async(req,res)=>{
// how do we get teh [project member]-> we will ahve accesss to Project thn to its projectmember by aggregation pipeline
const {projectId}= req.params;
 const project=await Project.findById(req.params)

 if(!project){
     throw new ApiError(404, "Project not found")
 }

 const projectMembers= await ProjectMember.aggregate([
    {
        $match:{
            project: new mongoose.Types.ObjectId(projectId)// if this agg run correctly it measn we got our projectId matched
        }
    } ,{
        $lookup:{
            from:"users",
            localField: "user",
            foreignField: "_id",
            as: "user",
            pipeline: [
                {
                    $project: {
                        _id:1,
                        username:1,
                        fullName: 1,
                        avatar: 1
                    }
                }
            ]
        }
    },

    {
        $addField:{
            user:{
                $arrayElemAt: ["$user",0]
            }
        }
    },
     {
        $project:{
            project: 1,
            user:1,
            role:1,
            createdAt:1,
            updateAt:1,
            _id:0
        }
    } ]);


    return res.status(200).json(new ApiResponse(200,projectMembers,"project members fetched sucessfully"))

});

 

export {getProjectMembers,addMembersToProject,deleteProject,updateProject,createProject,getProjectById,getProject,deleteMember,updateMemberRole}; 