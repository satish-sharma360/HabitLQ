import userModel from "../model/user.model.js"

const createUser = async (data) =>{
    const user = await userModel.create(data)
    return user
}
export {createUser}