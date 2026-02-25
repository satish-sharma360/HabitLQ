import jwt from 'jsonwebtoken'

const GenerateToken = async(payload , secret) =>{
    return await jwt.sign({payload} , secret , {expiresIn:'7d'})
}

const VerifyToken = async(token , secret) => {
    return await jwt.verify(token , secret)
}
export {GenerateToken ,VerifyToken}