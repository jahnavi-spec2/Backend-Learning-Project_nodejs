import Mailgen from "mailgen";
import nodemailer from "nodemailer";

// 2nd step is to send email...seemailtrao an 1stly import nodemailer
// it is prep email..which takes time nd so async await

const sendEmail= async (options)=>{ 
    const mailGenerator=new Mailgen({//  
        theme:"default",
        product:{
            name:"The Ugly Crowd",//our aplliaction name willbe
            link:"https://welcometoportal.com"// doesnt exist..now somebody will give options and basd on thm email will be generatoors
        }
    });
    const emailTextual= mailGenerator.generatePlaintext(options.mailgenContent)

    const emailHtml= mailGenerator.generate(options.mailgenContent)// this is still preparations and is not yet send

   const transporter= nodemailer.createTransport({// his is tht step
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    })
 
// 2nd step is to send email...seemailtrao an 1stly import nodemailer
// it is prep email
const mail={
    from:"mail.taskmanager@abc.com",// from where we are going to send the mail
    to:options.email ,// receivers email
    subject: options.subject   ,// so tht anybody can use this
    text:  emailTextual  ,
    html:emailHtml
}
try{// wrap everything in try catch since email may have errro

    await transporter.sendMail(mail);
}
catch(error){
    console.error("Email service failed silently. Make sure U have provided your credentials ");
   throw error; 
}
}
// 1st step after importing gmail is to wriet a conttent to generate email and a body 
const emailVerificationMailgenContent=(username, verificationUrl) => { 
    // username and verifiaaction  email given by user
return{
    body:{
        name: username,
        intro:" Welcome To Our App! we'r excited to have you on board",
        action: {
            instruction:
            "To verify your email pls click on the following button",
            button:{
                color: "rgb(45, 171, 121)",
                text : "Verify Your Email",
                link :verificationUrl,// whtever email u have given to me we will use it here
            },
        },

        outro:
        "Need help, or have any question regarding the information? Just reply to this email, we'd love to help."
    },
};

};

// similar type of content is given for fogot password page

const forgotPasswordMailgenContent=(username, passwordResetUrl) =>{
return{
    body:{
        name: username,
        intro:" Fogeot Password? Here is how you proceed to reset ",
        action: {  
            instructions:
            "To Reset the password ! Click on the Button or link given Below",
            button:{
                color: "rgb(45, 171, 121)",
                text : "Reset Password",
                link :passwordResetUrl,
            },
        },

        outro:
        "Need help, or have any question regarding the information? Just reply to this email, we'd love to help."
    },
};

}


export {emailVerificationMailgenContent,forgotPasswordMailgenContent,sendEmail};