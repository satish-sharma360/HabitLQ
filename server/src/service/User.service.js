import userModel from "../model/user.model.js"

const createUser = async (data) =>{
    const user = await userModel.create(data)
    const userdata = await user.save
    return userdata
}
export {createUser}