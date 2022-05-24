const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

const getAllUsers = async() => await prisma.user.findMany();

const getUserWithKey = async(key)=> {
    //unique id,username,email,phone
    await prisma.user.findUnique({
        where:{
            email: key,
            id: key,
            phoneNo: key,
            username:{equals:key}
        },select:{
            id:true,username:true,name:true,email:true,phoneNo:true
        }
    }
)}

const createUser =  async(user)=>{
    const {username, email, name, phoneNo, password}= user;
    const insertUser = await prisma.user.create({
        data:{
            username, email, name, phoneNo, password
        },select:{
            id:true,username:true,name:true,email:true,phoneNo:true
        }
    })
    return insertUser;
} 


const updateUser = async(id, update)=>{
    const updateuser = await prisma.user.update({
        where:{id: id},
        data:{...update},
        select:{
            id:true,username:true,name:true,email:true,phoneNo:true
        }
    })
}

const updatePassword = async(id, password)=>{
    const updatePassword = await prisma.user.update({
        where:{id: id},
        data:{password: password},
        select:{
            id:true,username:true,name:true,email:true,phoneNo:true
        }
    })
}

const deleteUser = async(key)=>{
    const deleteUser = await prisma.user.delete({
        where:{
       //try or not sure if he go work
            OR:[
                {id: key},
                {email: key},
                {phoneNo: key},
                {username: key}
            ]
        }
    }
)}

const isUserExist = async(email, username, phoneNo)=>{
    const user = await prisma.user.findFirst({
        where:{
            OR:[
                {email: email},
                {username: username},
                {phoneNo: phoneNo}
            ],
        }, select:{
            id:true,username:true,name:true,email:true,phoneNo:true,password:true
        }
    })
    return user
}


module.exports ={
    getAllUsers,
    createUser,
    getUserWithKey,
    updateUser,
    deleteUser,
    isUserExist,
    updatePassword
}
