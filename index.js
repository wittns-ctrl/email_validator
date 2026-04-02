import express from 'express'
import validator from 'validator'
import {promises as  dns} from 'dns'
import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config()


const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.post('/email', async(req,res)=>{
    const {email} = req.body;
    try{
   const isValid = validator.isEmail(email)
   if(isValid){
    const domain = email.split('@')[1];
    const records = await dns.resolveMx(domain);
    if(records.length === 0){
        res.status(400).json({valid:false,
            reason:"domain has no Mx records"
        })
    }
    else{
       const apikey = process.env.MAILBOXLAYERAPI
       const url = `https://apilayer.net/api/check?access_key=${apikey}&email=${email}`
       const data = await axios.get(url);
       if(data){
       res.status(200).json(data.data)
       }
       else{
        res.status(400).json({message:"email verification failed"})
       }
    }
   }
   else{
    res.status(400).json("bad email synthax")
   }
    }catch(error){
        console.error("error message:",error.message)
        res.status(500).json("something went wrong")
    }
})
app.listen(PORT,()=> {
    console.log(`server running on PORT: ${PORT}`)
})
