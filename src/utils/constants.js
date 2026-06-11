export const UserRolesEnums={
    ADMIN:"adminxxx",
    PROJECT_ADMIN: "project_admin",
    MEMBER:"member"
}//yha we r actually sending all objects as one

export const AvailableUserRole =Object.values(UserRolesEnum);//here we r sending objects as arrays...ofn admin member and project admin

export const TaskStatusEnum={
    TODO:"todo",
    IN_PROGRESS:"in_progress",
    DONE:"done",
};

export const AvailabelTaskStatus = Object.values(TaskStatusEnum);