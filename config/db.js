import mongoose from "mongoose";

export const connectDb = async()=>{
      console.log("MONGO_URI:", process.env.MONGO_URI);
      mongoose.connect(process.env.MONGO_URI , 
        {
            dbName : "enest"
        }
      ).then(()=>{
        console.log("connected to database")
      }).catch(err =>{
        console.log("Database connection failed" , err)
      })
}