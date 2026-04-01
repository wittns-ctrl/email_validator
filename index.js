import express from 'express'
import validator from 'validator'
import dns from 'dns'
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
        res.status(200).json({
            valid:true,
            reason:`Domani accepts ${records.length}Mx records`
        })
    }
   }
   else{
    res.status(400).json("bad email synthax")
   }
    }catch(error){
        console.error("error message:",error.message)
    }
})
app.listen(PORT,()=> {
    console.log(`server running on PORT: ${PORT}`)
})
