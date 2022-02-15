import Comment from "../../models/Comment.js";
import Question from "../../models/Question.js";
import User from "../../models/User.js";

export const handleCreateQuestion = async(req, res) => {
    const {values: {topic, category, description}, uid} = req.body;

    // get user from input uid
    var user, updatedUser;
    try {
        user = await User.findById(uid);
    } catch(error) {
        console.log('error has occurred when trying to make a query at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is doing a query"});
        return;
    }

    // if no such user with input uid exists
    if(user === undefined) {
        res.json({msg: "failure", detail: "this is not a valid uid"});
        return;
    }

    // if the user doesn't have even coin
    if(user.coin < 5) {
        res.json({msg: "failure", detail: "user coin is not enough"});
        return;
    }

    // update user coin and xp
    try {
        updatedUser = await User.findOneAndUpdate({_id: uid}, {$set: {coin: user.coin - 5, xp: user.xp + 5}}, {new: true, useFindAndModify: false});
    } catch(error) {
        console.log('error has occurred when trying to update a user document at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is updating a document"});
        return;
    }

    // create question document
    try {
        const response = await new Question({topic: topic, category: category, description: description, uid: user, time: new Date()}).save();
        res.json({msg: 'success', user: {coin: updatedUser.coin, xp: updatedUser.xp}});
    } catch(error) {
        console.log('error has occurred when trying to create new question document at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is creating a new document"});
        return;
    }
}

export const handleGetQuestionByPage = async(req, res) => {
    const page = req.query['0'];

    // get total pages by divide document count by 10, and get questions in specific page
    try {
        const questions = await Question.find({}).sort({time: 'desc'}).skip(10 * (page - 1)).limit(10).populate({
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
        });
        const cnt = await Question.find().estimatedDocumentCount();
        res.json({msg: "success", questions, pages: Math.ceil(cnt / 10)});
    } catch(error) {
        console.log('error has occurred when trying to make a query at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is doing a query"});
        return;
    }
}

export const handleGetQuestionByUser = async(req, res) => {
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

    // get questions correspond to input uid
    try {
        const response = await Question.find({uid: uid}).sort({time: 'desc'}).skip(10 * (page - 1)).limit(10).populate({
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
        });
        const cnt = await Question.find({uid: uid}).countDocuments();
        res.json({msg: "success", response, pages: Math.ceil(cnt / 10)});
    } catch(error) {
        console.log('error has occurred when trying to make a query at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is doing a query"});
        return;
    }
}

export const handelGetQuestionByKeyword = async(req, res) => {
    var {keyword, page} = req.query;
    // handle parameters not provided
    keyword = keyword === undefined ? "" : keyword;
    page = page === undefined ? 1 : page;

    // get questions base on input keyword and page count
    try {
        const questions = await Question.find().or([{topic: {$regex: keyword}}, {category: {$regex: keyword}}, {description: {$regex: keyword}}]).sort({
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
        });
        const cnt = await Question.find().or([{topic: {$regex: keyword}}, {category: {$regex: keyword}}, {description: {$regex: keyword}}]).countDocuments();
        res.json({msg: 'success', questions, pages: Math.ceil(cnt / 10)});
    } catch(error) {
        console.log('error has occurred when trying to make a query at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is doing a query"});
        return;
    }
}

export const handleSetBestComment = async(req, res) => {
    const {qid, cid} = req.body;

    // get comment by input cid
    var question, comment, updatedUser;
    try {
        comment = await Comment.findById(cid);
    } catch(error) {
        console.log('error has occurred when trying to make a query at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is doing a query"});
        return;
    }

    // if no comment with such cid exists
    if(comment === undefined) {
        res.json({msg: 'failure', detail: 'no such comment exists'});
        return;
    }

    // get question by input qid
    try {
        question = await Question.findById(qid);
    } catch(error) {
        console.log('error has occurred when trying to make a query at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is doing a query"});
        return;
    }

    // if no comment with such cid exists
    if(comment === undefined) {
        res.json({msg: 'failure', detail: 'no such comment exists'});
        return;
    }

    // update question user coin
    try {
        const user = await User.findById(question.uid);
        updatedUser = await User.findOneAndUpdate({_id: question.uid}, {$set: {coin: user.coin + 3}}, {new: true, useFindAndModify: false});
    } catch(error) {
        console.log('error has occurred when trying to update a user document at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is updating a document"});
        return;
    }

    // update comment user coin and xp
    try {
        const user = await User.findById(comment.uid);
        const resposne = await User.findOneAndUpdate({_id: comment.uid}, {$set: {coin: user.coin + 3, xp: user.xp + 30}}, {new: true, useFindAndModify: false});
    } catch(error) {
        console.log('error has occurred when trying to update a user document at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is updating a document"});
        return;
    }

    // set best comment for question
    try {
        const response = await Question.updateOne({_id: qid}, {best_comment: comment});
        res.json({msg: 'success', user: {coin: updatedUser.coin, xp: updatedUser.xp}});
    } catch(error) {
        console.log('error has occurred when trying to update a user document at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is updating a document"});
        return;
    }
}