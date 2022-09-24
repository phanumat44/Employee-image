//const MONGO_URL = "mongodb+srv://Admin:admin123@nextldcrud.5nhms3d.mongodb.net/?retryWrites=true&w=majority"

import mongoose from "mongoose"

const connectMongo = async ()=>{
    try{

     const {connection} = await  mongoose.connect(process.env.MONGO_URL)
   

     if(connection.readyState == 1){
        console.log("Database Connected")
     }

        } catch(errors){
            return Promise.reject(errors)
        }
    }

    export default connectMongo;
