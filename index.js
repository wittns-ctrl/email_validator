import express from 'express'
import validator from 'validator'
import {promises as  dns} from 'dns'
import axios from 'axios';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()


const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.post('/email', async(req,res)=>{
    const {email,Rec_email} = req.body;
    try{
    const isValid = validator.isEmail(email)
   if(!isValid){
    res.status(400).json({message: "bad email synthax"})
   }

   const domain = email.split('@')[1]
   const records = await dns.resolveMx(domain)

   if(records.lenght === 0){
    res.status(400).json({valid: false, reason: "domain has no Mx records" })
   }

   const apikey = process.env.MAILBOXLAYERAPI
   const url = `https://apilayer.net/api/check?access_key=${apikey}&email=${email}`
   const datum = await axios.get(url)
   if(datum.data && datum.data.format_valid){
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:email,
            pass: process.env.APP_PASSWORD
        }
    }
    )
    const mailOptions = {
        from : email,
        to:Rec_email,
        subject: 'Hello',
        text: "welcome to our company 🎉"
    }
    await transporter.sendMail(mailOptions)
    res.status(200).json({message:"email sent successfully"})
   }
   else {
    res.status(400).json({message: "email verification failed via API"})
   }
    }catch(error){
        console.error("error message:",error.message)
        res.status(500).json("something went wrong")
    }
})
app.listen(PORT,()=> {
    console.log(`server running on PORT: ${PORT}`)
})
