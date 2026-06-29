import {Router } from "express";
import {getProjectMembers,addMembersToProject,deleteProject,updateProject,createProject,getProjectById,getProject,deleteMember,updateMemberRole} from "../controllers/project.controllers.js";
import {validate} from "../middlewares/validator.middleware.js";
import { createProjectValidator, addMembertoProjectValidator} from "../validators/index.js";
import {verifyJWT,validateProjectPermission} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnums } from "../utils/constants.js";


const router=Router();
router.use(verifyJWT)

router.route("/").get(getProjects).post(createProjectValidator(),validate,createProject)
 
router.route("/:projectId").get(validateProjectPermission(AvailableUserRole),getProjectById).put(validateProjectPermission([UserRolesEnums.ADMIN]),
createProjectValidator(),validate, updateProject)
.delete(
    validateProjectPermission([UserRolesEnums.ADMIN]),
    deleteProject
);

router.route("/:projectId/members").get(validateProjectPermission([UserRolesEnums.ADMIN]),addMembersToProjectValidators(),validate,addMembersToProject)


router.route("/:projectId/members/:userId").put(validateProjectPermission([UserRolesEnums.ADMIN]), updateMemberRole).delete(validateProjectPermission([UserRolesEnums.ADMIN]), deleteMember)










export default router;