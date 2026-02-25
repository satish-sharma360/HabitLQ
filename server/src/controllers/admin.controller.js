import AppError from "../utils/AppError.js";

import userModel from "../model/user.model.js";
import postModel from "../model/post.model.js";

const getAllUsers = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const users = await userModel.find().select("-password").skip(skip).limit(limit)
    res.status(200).json({
        status: "success",
        results: users.length,
        data: users,
    });
})

const deleteUsers = catchAsync(async (req, res, next) => {
    const user = await userModel.findById(req.params.id);

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    await user.deleteOne();

    res.status(200).json({
        status: "success",
        message: "User deleted successfully",
    });
})

const verifypost = catchAsync(async (req, res, next) => {
    const post = await postModel.findById(req.params.postId);

    if (!post) {
        return next(new AppError("Post not found", 404));
    }

    post.isVerified = true;
    await post.save();

    res.status(200).json({
        status: "success",
        message: "Post verified",
    });

})
export { getAllUsers, deleteUsers ,verifypost}