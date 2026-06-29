import {User} from "../models/user.models.js";
import {Project} from "../models/project.models.js";
import {Task} from "../models/task.models.js";
import {SubTask} from "../models/subtask.model.js";

import {ApiResponse} from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js";
import {ApiError} from "../utils/api-error.js";
import mongoose from "mongoose";
import { AvailabelTaskStatus, AvailableUserRole ,UserRolesEnums} from "../utils/constants.js";

const getTasks=asyncHandler(async(req,res)=>{

});

const createTasks=asyncHandler(async(req,res)=>{
const {title,description}=req.body;
const {projectId}=req.params;

const task=await Task.create({
    title,
    description,
    project:new mongoose.Types.ObjectId(projectId),
    assignedBy:new mongoose.Types.ObjectId(req.user._id),
    assignedTo:new mongoose.Types.ObjectId(req.user._id),
    status: AvailabelTaskStatus?AvailableUserRole: new ApiError("Task not available")

})
});


const getTaskById=asyncHandler(async(req,res)=>{

});



const updateTask=asyncHandler(async(req,res)=>{

});



const deleteTask=asyncHandler(async(req,res)=>{

});


const createSubTasks=asyncHandler(async(req,res)=>{

});

const updateSubTask=asyncHandler(async(req,res)=>{

});

const deleteSubTask=asyncHandler(async(req,res)=>{

});


export{
    deleteSubTask,updateSubTask,createSubTasks,deleteTask,updateTask,getTaskById,createTasks,getTasks
}