import mongoose from "mongoose";

const connectDB = async()=>{
    try{
      const conn = await mongoose.connect("mongodb+srv://vishnuvardhan:vishnuvardhan@cluster0.xh5f3t4.mongodb.net/?retryWrites=true&w=majority")
      console.log("Connected to Mongodb Database")
    }catch(error){
        console.log(`Error in Mongodb ${error}`)
    }
};

export default connectDB;


