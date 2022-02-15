import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    topic: {
        type: String,
        required: [true, "topic field is required"]
    },
    uid: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "uid field is required"]
    },
    time: {
        type: Date,
        required: [true, "time field is required"]
    },
    category: {
        type: String,
        required: [true, "category field is required"]
    },
    description: {
        type: String,
        required: [true, "description field is required"]
    },
    bestComment: {
        type: mongoose.Types.ObjectId,
        ref: "Comment"
    },
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: "Comment",
    }],
    best_comment: {
        type: mongoose.Types.ObjectId,
        ref: "Comment"
    }
})

export default mongoose.model('Question', questionSchema);