
exports.getUserLogin = (req, res, next) => {
    res.render("./user/login");
};

exports.getNew = (req, res, next) => {
    res.render("./user/new");
}

exports.postNew = async (req, res, next) => {
    //code to create a new user account
    res.redirect("/users/login");
};