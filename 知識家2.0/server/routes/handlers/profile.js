import User from "../../models/User.js";

export const handleGetUserProfile = async(req, res) => {
    const {uid} = req.query;

    try {
        const user = await User.findById(uid);
        res.json({msg: "success", user: {name: user.name, mail: user.mail, birth: user.birth, intro: user.intro, xp: user.xp, coin: user.coin}});
    } catch(error) {
        console.log('error has occurred when trying to make a query at mongodb', error);
        res.json({msg: "failure", detail: "error has occurred when server is doing a query"});
    }
}