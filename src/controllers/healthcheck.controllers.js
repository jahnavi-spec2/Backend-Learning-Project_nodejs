import { ApiResponse} from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js";


        // sometimes we need to await ...thus make this healthcheck async...and also catch does not work like tht addd a new next var...middleware part and thn pass err to it
        //it is the bare min
        // however its not a agood idea to yse too much try-cach
        // so we make a sep folder async handler 
// const healthCheck = async (req,res.next)=> {
//     try{
//         let user = await getUserFromDB()
//         res.
//         status(200).
//         json(
//             new ApiResponse(200, {message: "Server is running"})
//         )
//      } catch (error){
//        next(err);
//     }
// };

// the above is 1st type ...
// below one is more relatable any used anywhere ...its the 2nd type

const healthCheck= asyncHandler(async(req,res)=>{
    res
    .status(200)
    .json(new ApiResponse(200,{ message:"Server is Still Running"}));
})

export {healthCheck};