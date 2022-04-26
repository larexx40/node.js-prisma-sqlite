const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

const getAllUsers = async() => await prisma.user.findMany();

const getUserWithKey = async(key)=> {
    //unique id,username,email,phone
    await prisma.user.findUnique({where:{
        email: key,
        id: key,
        phoneNo: key,
        username:{equals:key}
    }})
}

const createUser = async(user)=>{
    const {username, email, name, phoneNo, password}= user;
    const insertUser = await prisma.user.create({
        data:{username, email, name, phoneNo, password}
    })
} 

const updateUser = async(user)=>{
    const updateuser = await prisma.user.update({where:{
        data:{user}
    }})
}

const deleteUser = async(key)=>{
    const deleteUser = await prisma.user.delete({where:{
       //try or not sure if he go work
       OR:[
        {id: key},
        {email: key},
        {phoneNo: key},
        {username: key}
       ]
    }})
}

const isUserExist = async(email, username, phoneNo)=>{
    await prisma.user.findFirst({where:{
        OR:[
        {email: email},
        {username: username},
        {phoneNo: phoneNo}
        ]
    }})
}

module.exports ={
    getAllUsers,
    createUser,
    getUserWithKey,
    updateUser,
    deleteUser,
    isUserExist
}

