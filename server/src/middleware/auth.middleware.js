import userModel from "../model/user.model.js";
import { VerifyToken } from "../service/token.service.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";


const Protected = catchAsync(async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];

    if (!token || token === 'undefined') {
        return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    const decoded = await VerifyToken(token, process.env.JWT_SECRET)

    const currentuser = await userModel.findById(decoded.payload.id);

    if (!currentuser) {
        return next(new AppError('User no longer exists', 401))
    }
    req.user = currentuser;
    next();
})

export const getAdmin = catchAsync(async (req, res, next) => {
    if (req.user.role === 'admin') {
        next()
    }
})

export default Protected