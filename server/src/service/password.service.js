import bcrypt from "bcrypt"

const HashPassword = async (password) =>{
    return await bcrypt.hash(password , 10)
}

const ComparePassword = async (password , userPassword) =>{
    return await bcrypt.compare(password , userPassword)
}

export {HashPassword , ComparePassword}