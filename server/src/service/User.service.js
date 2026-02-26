import userModel from "../model/user.model.js"

const createUser = async (data) =>{
    const user = await userModel.create(data)
    console.log("data is ",data)
    console.log(user);
    return await user.save
}
export {createUser}