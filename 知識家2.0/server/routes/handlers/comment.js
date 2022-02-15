import Question from "../../models/Question.js";
import User from "../../models/User.js";
import Comment from "../../models/Comment.js";
import mongoose from "mongoose";

export const handleGetCommentByUser = async(req, res) => {
    var {uid, page} = req.query;
    page = page === undefined ? 1 : page;

    // get user from input uid
    var user;
    try {
        user = await User.findById(uid);
    } catch(error) {
        console.log('error has occurred when trying to make a query at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is doing a query"});
        return;
    }

    // if no such user with input uid exists
    if(user === undefined) {
        res.json({msg: "failure", detail: "this not a valid uid"});
        return;
    }

    // first get comments by uid, then get distinct qid
    var comments;
    try {
        comments = await Comment.aggregate([{$match: {uid: mongoose.Types.ObjectId(uid)}}, {$group: {_id: '$qid'}}]);
        const cnt = await Comment.find({uid: uid}).countDocuments();
    } catch(error) {
        console.log('error has occurred when trying to make a query at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is doing a query"});
        return;
    }
    
    // use distinct qid to get questions, sort by time, skip by page, and limit to 10
    try {
        const response = await Question.find({'_id': {$in: comments}}).sort({
            time: 'desc'
        }).skip(10 * (page - 1)).limit(10).populate({
            path: 'uid',
            select: {
                name: 1
            }
        }).populate({
            path: 'comments',
            select: {
                uid: 1,
                content: 1,
                time: 1
            },
            populate: {
                path: 'uid',
                select: {
                    name: 1
                }
            } 
        });;
        const cnt = await Question.find({'_id': {$in: comments}}).countDocuments();
        res.json({msg: "success", response, pages: Math.ceil(cnt / 10)});
    } catch(error) {
        console.log('error has occurred when trying to make a query at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is doing a query"});
        return;
    }
}

export const handleAddComment = async(req, res) => {
    const {uid, qid, content} = req.body;

    // get user from input uid
    var user, question, updatedUser;
    try {
        user = await User.findById(uid);
    } catch(error) {
        console.log('error has occurred when trying to make a query at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is doing a query"});
        return;
    }

    // get question from input qid
    try {
        question = await Question.findById(qid);
    } catch(error) {
        console.log('error has occurred when trying to make a query at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is doing a query"});
        return;
    }

    // if no such user with input uid or such question with input qid exists
    if(user === undefined || question === undefined) {
        res.json({msg: "failure", detail: "uid or qid is not valid"});
        return;
    }

    // update user xp
    try {
        updatedUser = await User.findOneAndUpdate({_id: uid}, {$set: {xp: user.xp + 1}}, {new: true, useFindAndModify: false});
    } catch(error) {
        console.log('error has occurred when trying to update a user document at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is updating a document"});
        return;
    }

    // create a new comment
    var comment;
    try {
        comment = await new Comment({qid: question, uid: user, content: content, time: new Date()}).save();
    } catch(error) {
        console.log('error has occurred when trying to create new comment document at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is creating a new document"});
        return;
    }

    // find the question correspond to input qid than push new created comment into its comments
    try {
        const response = await Question.findOneAndUpdate(
            {
                _id: qid
            }, 
            {
                $push: {
                    comments: comment
                }
            },
            {
                useFindAndModify: false,
                new: true
            }
        );
        res.json({msg: "success", response, user: {coin: updatedUser.coin, xp: updatedUser.xp}});
    } catch(error) {
        console.log('error has occurred when trying to update a question document at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is updating a document"});
        return;
    }

}