import "dotenv/config"
import nodemailer from 'nodemailer'



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
})



// Verify the connection configuration
transporter.verify()
.then(() => {console.log("Email transporter is ready to send emails")})
.catch((err) =>{
  console.log("Emial transporter verification failed:" , err)
})



export async function sendEmail({to , subject , html}) {
    const mailOptions ={
        from : process.env.GOOGLE_USER,
        to,
        subject,
        html 
    }

    

    const details = await transporter.sendMail(mailOptions)
    console.log("Email sent:" , details)
    
}