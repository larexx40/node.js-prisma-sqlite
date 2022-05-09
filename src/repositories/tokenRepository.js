//istoken exist
//create token
//delete token
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const isTokenExist = async (userId)=>{
    await prisma.token.findFirst({
        where:{
            OR:[
                {id},
                {userId}
            ]
        },
        select:{
            id:true, userId: true, token: true, expiresAt: true
        }
    })
}

const createToken = async (data)=>{
    const {userId, token, expiresAt} = data
    await prisma.token.create({
        data:{
            userId, token, expiresAt
        }, select:{
            id:true, userId: true, token: true, expiresAt: true
        }
    })
}

const deleteToken = async (id)=>{
    await prisma.token.delete({
        where:{id}
    })
}

module.exports ={
    isTokenExist, 
    createToken,
    deleteToken
}