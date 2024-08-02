import express from "express"
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js"
import dotenv from "dotenv"
import cors from "cors"
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"


//configure env
dotenv.config();


//rest object
const app = express();

//database  config
connectDB();

//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

//routes
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/category",categoryRoutes);
app.use("/api/v1/product",productRoutes); 


//rest api
app.get("/",(req,res)=>{
    res.send("<h1> Welcome to the e commerce</h1>")
})

//PORT
const PORT=8080

//run listen
app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})
