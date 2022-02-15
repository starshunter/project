import {createHash} from 'crypto';
import User from '../../models/User.js';
import {makeTransporter, makeConfirmationMail, sendMail, makeRestPasswordMail} from "../../utils/confirmUserUtils.js";

const transporter = makeTransporter('Gmail', '2.0answers2.0@gmail.com', 'Answers2.0');

export const handleLogin = async(req, res) => {
    const {mail, password} = req.body.values;

    // compute hash for input password
    const hash = createHash('sha256').update(password).digest('hex');
    
    try {
        // find user with input mail
        const response = await User.find({'mail': mail});

        // there's no user registered with input mail
        if(response.length === 0) {
            res.json({msg: 'failure', detail: 'this mail is not registered'});
            return;
        }

        // the input password doesn't match with password stored in db
        else if(response[0].password !== hash) {
            res.json({msg: 'failure', detail: 'wrong password'});
            return;
        }

        // this user has not activated
        // else if(response[0].activated === false) {
        //     res.json({msg: 'failure', detail: 'account has not be activated'});
        //     return;
        // }

        // successful login
        else {
            const user = response[0];
            res.json({msg: 'success', mail: user.mail, name: user.name, birth: user.birth, intro: user.intro, xp: user.xp, coin: user.coin, uid: user._id});
        } 
    } catch(error) {
        console.log('error has occurred when trying to make a mongodb query', error);
        res.json({msg: 'failure', detail: 'something went wrong on server'});
        return;
    }
}

export const handleSignup = async(req, res) => {
    const {mail, name, password, birth} = req.body.values;

    // check if the mail has been registerd or not
    try {
        const response = await User.find({'mail': mail});
        if(response.length !== 0) {
            res.json({msg: 'failure', detail: 'this mail has been registered'});
            return;
        }
    } catch(error) {
        console.log('error has occurred when trying to make a mognodb query', error);
        res.json({msg: 'failure', detail: 'something went wrong when trying to connect to mongodb'});
        return;
    }

    // compute hash for input password
    const hash = createHash('sha256').update(password).digest('hex');
    const confirmationHash = createHash('sha256').update(mail + password).digest('hex');

    // add new user to mongodb
    try {
        const user = await new User({name: name, mail: mail, password: hash, birth: birth, intro: "", xp: 0, coin: 10, activated: false, confirmationHash: confirmationHash}).save();
        res.json({msg: 'success', name: user.name, mail: user.mail});
    } catch(error) {
        console.log('error has occurred when trying to save new user document', error);
        res.json({msg: 'failure', detail: 'something went wrong when trying to register user'});
        return;
    }

    // send confirmation mail to registered mail address
    try {
        const mailOptions = makeConfirmationMail(mail, name, confirmationHash);
        sendMail(transporter, mailOptions);
    } catch(error) {
        console.log('error has occurred when trying to send confirmation mail', error);
        return;
    }
}

export const handleConfirm = async(req, res) => {
    const {confirmationHash} = req.query

    // if the confirmation hash is wrong
    try {
        const user = await User.find({confirmationHash});
        if(user.length === 0) {
            res.send('錯誤發生，請重新要求一封認證郵件');
            return;
        }
        if(user[0].activated === true) {
            res.send('你的帳號已經認證完畢');
            return;
        }
    } catch(error) {
        res.send('伺服器發生錯誤，請稍後再試');
        console.log('error has occurred when trying to make a query to mongodb', error);
        return;
    }

    // use confirmation hash to find and update user's activated field
    try {
        const response = await User.updateOne({confirmationHash}, {activated: true});
        if(response.ok === 1) {
            res.send(`<p>恭喜你完成認證，你現在可以進入<a href="https://answers2.herokuapp.com/">知識家2.0</a></p>`);
        }
        else {
            res.send('認證錯誤，請再試一遍或重新要求一封認證郵件');
        }
    } catch(error) {
        res.send('伺服器發生錯誤，請稍後再試');
        console.log('error has occurrend when trying to make an update to mongodb');
        return;
    }
}

export const handleResendConfirmation = async(req, res) => {
    const {mail} = req.body.values;

    // get user from input mail
    var user;
    try {
        user = await User.find({mail: mail}); 
    } catch(error) {
        console.log('error has occurred when trying to make a query at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is doing a query"});
        return;
    }

    // if no user with such mail exists
    if(user.length === 0) {
        res.json({msg: 'failure', detail: 'this mail is not registered'});
        return;
    }

    // if the user has been activated
    if(user[0].activated === true) {
        res.json({msg: 'failure', detail: 'this user has activated'});
        return;
    }

    // send confirmation mail to registered mail address
    try {
        const mailOptions = makeConfirmationMail(user[0].mail, user[0].name, user[0].confirmationHash);
        sendMail(transporter, mailOptions);
        res.json({msg: 'success'});
    } catch(error) {
        console.log('error has occurred when trying to send confirmation mail', error);
        return;
    }
}

export const handleResetPassword = async(req, res) => {
    const {mail} = req.body.values;

    // get user from input mail
    var user;
    try {
        user = await User.find({mail: mail}); 
    } catch(error) {
        console.log('error has occurred when trying to make a query at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is doing a query"});
        return;
    }

    // if no user with such mail exists
    if(user.length === 0) {
        res.json({msg: 'failure', detail: 'this mail is not registered'});
        return;
    }

    // generate random new password
    const newPassword = createHash('sha256').update(mail + user[0].password).digest('hex');
    const newPasswordHash = createHash('sha256').update(newPassword).digest('hex');
    const newConfirmationHash = createHash('sha256').update(mail + newPassword).digest('hex');

    // set password and confirmation hash
    try {
        const response = await User.updateOne({mail: mail}, {password: newPasswordHash, confirmationHash: newConfirmationHash});
        res.json({msg: "success"});
    } catch(error) {
        console.log('error has occurred when trying to update a user document at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is updating a document"});
        return;
    }

    // send email containing new password
    try {
        const mailOptions = makeRestPasswordMail(mail, user[0].name, newPassword);
        sendMail(transporter, mailOptions);
    } catch(error) {
        console.log('error has occurred when trying to send reset password mail', error);
        return;
    }
}