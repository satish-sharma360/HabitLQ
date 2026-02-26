import jwt from 'jsonwebtoken'

const GenerateToken = async(payload) =>{
    return await jwt.sign({payload} , process.env.JWT_SECRET , {expiresIn:'7d'})
}

const VerifyToken = async(token , secret) => {
    return await jwt.verify(token , secret)
}
export {GenerateToken ,VerifyToken}