const nodeMailer = require('../config/nodemailer');


 // this is another way of exporting a method
 exports.PasswordForgot = (forgotPassUser) =>{

     // console.log('inside new comment mailer');
     let htmlString = nodeMailer.renderTemplate({User: forgotPassUser} ,'/forgoPass/forgot_pass.ejs')

     console.log(htmlString);
     nodeMailer.transporter.sendMail({
         from : 'hoyt9936@gmail.com',
         to: forgotPassUser.email,
         subject: "Forgotten password",
         html: htmlString
     }).then(info =>{
         // console.log('Message Sent', info);
         return;
     }).catch(err=>{
         console.log('Error in sending mail',  err);
         return;
     });

 } 