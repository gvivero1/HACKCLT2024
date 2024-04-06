
// import register from "../store/index";
const {register} = require("../src/store/index");

exports.getUserLogin = (req, res, next) => {
    res.render("./user/login");
};

exports.getNew = (req, res, next) => {
    res.render("./user/new");
}

exports.postNew = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        await register(email, password)
        .then(({userRecord, userId}) => {
            console.log("User created successfully");
            console.log("User ID: ", userId);
            console.log("User Record: ", userRecord);
            res.redirect("/users/login");
        })
        .catch((error) => {
            next(error);
        });
        res.redirect("/users/login");
    } catch (error) {
        next(error);
    }
};