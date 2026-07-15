import mongoose from "mongoose";

//Article Schema

let articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

export default mongoose.model('Article', articleSchema);