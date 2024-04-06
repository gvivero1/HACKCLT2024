const User = require('../models/user');
exports.getUserLogin = (req, res, next) => {
    res.render("./user/login");
};

exports.getNew = (req, res, next) => {
    res.render("./user/new");
}

exports.postNew = async (req, res, next) => {
    //code to create a new user account
    const {email, password } = req.body;
    const user = new User({ email, password });
    console.log(user);

    try {
        await user.save();
        // Flash Success 
        req.flash('success', 'Account has been created');
        res.redirect('/users/login');
    } catch (error) {
        res.status(500).json({ error });
    }
};