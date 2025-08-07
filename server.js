const express=require("express")
const cors=require("cors")
const morgan=require("morgan")
const dotenv=require("dotenv")
const colors=require("colors")
const connectDB = require("./config/db")
//DOTENV
dotenv.config()
//Mongodb connection 
connectDB()
//REST OBJECT
const app=express()
//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//ROUTES
app.use('/api/v1/auth',require('./routers/userRoutes'));
app.use('/api/v1/post',require("./routers/postRoutes"));
//home
app.get("/",(req,res)=>{
    res.status(200).send({
        "success":true,
        "message":"Node server is running."
    })
})

//port
const PORT=process.env.PORT||8080

//listen 
app.listen(PORT,()=>{
    console.log(`server is running ${PORT}`.bgGreen.white)
})
