import User from "../../models/User.js";
import {createHash} from 'crypto';

export const handleChangePassowrd = async(req, res) => {
    const {values: {password, newPassword}, uid} = req.body;

    // compute hash for old password and new password
    const hash = createHash('sha256').update(password).digest('hex');
    const newHash = createHash('sha256').update(newPassword).digest('hex');

    // get user from input uid
    var user;
    try {
        user = await User.findById(uid);
    } catch(error) {
        console.log('error has occurred when trying to make a query at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is doing a query"});
        return;
    }

    // if no such user with input uid
    if(user === undefined) {
        res.json({msg: "failure", detail: "this not a valid uid"});
        return;
    }

    // if the input old password doesn't match the password store in mongodb
    if(user.password !== hash) {
        res.json({msg: "failure", detail: "the old password is wrong"});
        return;
    }

    // update user password to new password
    try {
        const response = await User.updateOne({_id: uid}, {password: newHash});
        res.json({msg: "success"});
    } catch(error) {
        console.log('error has occurred when trying to update a user document at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is updating a document"});
        return;
    }
}

export const handleChangeIntro = async(req, res) => {
    const {values: {intro}, uid} = req.body;

    // get user from input uid
    var user;
    try {
        user = await User.findById(uid);
    } catch(error) {
        console.log('error has occurred when trying to make a query at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is doing a query"});
        return;
    }

    // if no such user with input uid
    if(user === undefined) {
        res.json({msg: "failure", detail: "this not a valid uid"});
        return;
    }

    // update user intro
    try {
        const response = await User.updateOne({_id: uid}, {intro: intro});
        res.json({msg: "success"});
    } catch(error) {
        console.log('error has occurred when trying to update a user document at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is updating a document"});
        return;
    }
}