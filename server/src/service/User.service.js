const userModel = require("../model/user.model")

const createUser = async (data) =>{
    const user = await userModel.create({data})
    return await user.save
}
export {createUser}