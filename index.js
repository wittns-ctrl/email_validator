import express from 'express'
import validator from 'validator'
import dotenv from 'dotenv'
dotenv.config()


const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.post('/email', async(req,res)=>{
    try{
    const {email} = req.body;
   const isValid = validator.isEmail(email)
   if(isValid){
    res.status(200).json("email is valid")
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
