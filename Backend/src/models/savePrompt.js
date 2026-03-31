import mongoose from "mongoose";


const savePromptSchema = new mongoose.Schema({
    
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required: [true , "user is required"]
    },

    title:{
        type : String,
        required : [true , "title is required"],
        trim : true,
        default : "New prompt",
    },
    
    description :{
        type: String,
        required : [true , "prompt is required"],
        trim : true,
        maxlength : 800
    },
}, {
    timestamps : true
})


const savePromptModel = new mongoose.model('savePrompt' , savePromptSchema)

export default savePromptModel