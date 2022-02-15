import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    uid: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "uid field is required"]
    },
    qid: {
        type: mongoose.Types.ObjectId,
        ref: "Question",
        required: [true, "qid field is required"]
    },
    time: {
        type: Date,
        required: [true, "time field is required"]
    },
    content: {
        type: String,
        required: [true, "content field is requried"]
    }
})

export default mongoose.model('Comment', commentSchema);