const mongoose=require("mongoose")

//schema
const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Please add title."]
    },
    description:{
        type:String,
        required:[true,"Please add discription."]
    },
    postedBy:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    }

},{timestamps:true})
module.exports= mongoose.model("Post",postSchema);
