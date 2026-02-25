import userModel from "../model/user.model";
import { VerifyToken } from "../service/token.service.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";


const Protected = catchAsync(async (req , res , next) =>{
    let token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return next(new AppError('You are not logged in' , 401))
    }

    const decoded = await VerifyToken(token , process.env.JWT_SECRET)

    const currentuser = await userModel.findById(decoded.id);

    if(!currentuser){
        return next(new AppError('User no longer exists' , 401))
    }

    req.user = currentuser;

    next();
})