require('dotenv').config();
const  nodemailer = require('nodemailer');

//initialize nodemailer transporter
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASS
    }
})


//reset password mail option
const resetPasswordMail= async(username, email, token)=>{
    const mailOptions={
        from: '"Lanre" <lanretunji47@gmail.com>',
        to: email,//user.email
        subject: 'Reset Password',
        text: `Hello ${username} use this ${token} to reset your password`
    }

    transporter.sendMail(mailOptions, (err, response)=>{
        if (err){
            throw err
        }else{
            console.log("Message sent successfully");
            return{
                msg: "Mail Sent",
                status: 200,
                res: response
            }
        }
    })
}

const resetPasswordSuccessMail = async(username, email)=>{
    const mailOptions={
        from: '"Lanre" <lanretunji47@gmail.com>',
        to: email,
        subject: 'Reset Password',
        text: `Password reset successful`
    }

    transporter.sendMail(mailOptions, (err, response)=>{
        if (err){
            throw err
        }else{
            console.log("Message sent successfully");
            return{
                msg: "Mail Sent",
                status: 200,
                res: response
            }
        }
    })
}

const sendEmail = async(email, subject, text)=>{
    try {
        const mailOptions = {
            from: '"Lanre" <lanretunji47@gmail.com>',
            to: email,
            subject: subject,
            text: text
        }
        await transporter.sendMail(mailOptions)
        console.log("Email sent successfully");       
    } catch (error) {
        console.log("Email not sent");
    }
}

module.exports = {
    resetPasswordMail,
    resetPasswordSuccessMail,
    sendEmail
}