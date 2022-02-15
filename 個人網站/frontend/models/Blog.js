import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        require: [true, "title field is required"]
    },
    body: {
        type: String,
        require: [true, "body fiedl is required"]
    }
})

export default mongoose.models.Post || mongoose.model("Blog", blogSchema);