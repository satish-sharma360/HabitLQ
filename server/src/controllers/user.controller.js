const userModel = require("../model/user.model");
const { HashPassword, ComparePassword } = require("../service/password.service");
const { GenerateToken } = require("../service/token.service");
const { createUser } = require("../service/User.service");
const { default: AppError } = require("../utils/AppError");
const { default: catchAsync } = require("../utils/catchAsync");

const RegisterUser = catchAsync(async (req, res, next) => {
    const { name, email, password, conformPassword } = req.body

    if (!name || !email || !password) {
        return next(new AppError("All fields are required", 400));
    }

    if (password !== conformPassword) {
        return next(new AppError("Password and ConformPassword Shuld be match", 400));
    }

    const existing = await userModel.findOne({ email });

    if (existing) {
        return next(new AppError("User already registered", 400))
    }

    const hashPassword = await HashPassword(password);

    const user = await createUser({
        name, email, password: hashPassword
    })
    const payload = {
        id: user._id,
        role: user.role
    }
    const token = await GenerateToken(payload);

    res.status(201).json({
        status: "success",
        token,
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                level: user.level,
                xp: user.xp,
            },
        },
    });
})

const loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("Email and Password required", 400))
    }

    const user = await userModel.findOne({ email }).select("+password")

    const isMatch = await ComparePassword(password, user.password)

    if (!user || !isMatch) {
        return next(new AppError("Invalid credentials", 401))
    }
    const payload = {
        id: user._id,
        role: user.role
    }
    const token = await GenerateToken(payload)

    res.status(200).json({
        status: "success",
        token,
        user
    });
})

const logOut = (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    })
}

const getMe = catchAsync(async (next, req, res) => {
    const user = await userModel.findById(req.user._id).populate("badges");

    res.status(200).json({
        status: "success",
        data: user,
    });
})

const updateProfile = catchAsync(async (req, res, next) => {
    const id = req.user._id;

    if (!id) {
        return next(new AppError("Id is required", 400));
    }

    const filterBody = {};
    if (req.body.name) filterBody.name = req.body.name;
    if (req.body.email) filterBody.email = req.body.email;

    const updatedUser = await userModel.findByIdAndUpdate(id, { $set: filterBody }, { new: true, runValidators: true })

    if (!updatedUser) {
        return next(new AppError("No user found with that ID", 404));
    }

    res.status(200).json({
        status: "success",
        data: updatedUser
    });
})

export { RegisterUser, loginUser, logOut, getMe ,updateProfile}