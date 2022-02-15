import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    mail: {
        type: String,
        required: [true, 'mail field is required']
    },
    password: {
        type: String,
        required: [true, 'password filed is required']
    },
    name: {
        type: String,
        required: [true, 'name field is required']
    },
    xp: {
        type: Number,
        required: [true, "xp field is required"]
    },
    coin: {
        type: Number,
        required: [true, "coin field is required"]
    },
    birth: {
        type: Date,
        required: [true, "birth field is required"]
    },
    intro: {
        type: String
    },
    activated: {
        type: Boolean
    },
    confirmationHash: {
        type: String
    }
})

export default mongoose.model('User', userSchema);