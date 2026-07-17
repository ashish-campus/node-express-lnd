import mongoose from "mongoose";

// User Schema
 const userSchema = mongoose.Schema({
     name: {
         type: String,
         required: true
     },
     email: {
         type: String,
         required: true
     },
     username: {
         type: String,
         required: true
     },
     password: {
         type: String,
         required: true
     }
 });
 
 export default mongoose.model('User', userSchema);