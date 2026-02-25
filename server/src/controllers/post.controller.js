import postModel from "../model/post.model";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js"

const createPost = catchAsync(async (req, res, next) => {
    const { content, type } = req.body;

    if (!content) {
        return next(AppError('Post content is required', 400))
    }

    const post = await postModel.create({
        userId: req.user._id,
        content,
        type
    })

    res.status(201).json({
        status: "success",
        data: post,
    });
})

const feed = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const posts = await postModel.find()
        .populate("userId", "name level")
        .populate("comments.userId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

    res.status(200).json({
        status: "success",
        results: posts.length,
        data: posts,
    });
})

const toggleLike = catchAsync(async (req, res, next) => {
    const post = await postModel.findById(req.params.id);

    if (!post) {
        return next(new AppError("Post not found", 404));
    }

    const userId = req.user._id.toString();

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
        post.likes = post.likes.filter((id) => id.toString() !== userId)
    } else {
        post.likes.push(userId)
    }

    await post.save();

    res.status(200).json({
        status: "success",
        likesCount: post.likes.length,
    });
})

const addComments = catchAsync(async (req, res, next) => {
    const { text } = req.body;

    if (!text) {
        return next(new AppError("Comment text required", 400));
    }

    const post = await postModel.findById(req.params.id)

    if (!post) {
        return next(new AppError("Post not found", 404));
    }

    post.comments.push({
        userId: req.user._id,
        text
    })

    await post.save()

    res.status(201).json({
        status: "success",
        message: "Comment added",
    });
})

const deletePost = catchAsync(async (req, res, next) => {
    const post = await postModel.findById(req.params.id);

    if (!post) {
        return next(new AppError("Post not found", 404));
    }
    if (post.userId.toString() !== req.user._id.toString()) {
        return next(new AppError("Not authorized", 403));
    }

    await post.deleteOne();

    res.status(200).json({
        status: "success",
        message: "Post deleted",
    });
})

// ADMIN VERIFY POST

const verifyPost = catchAsync(async (req, res, next) => {
    const post = await postModel.findById(req.params.id);

    if (!post) {
        return next(new AppError("Post not found", 404));
    }

    post.isVerified = true;
    await post.save()

    res.status(200).json({
        status: "success",
        message: "Post verified",
    });
})

export {
    createPost,
    feed,
    toggleLike,
    addComments,
    deletePost,
    verifyPost
}