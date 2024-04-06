const User = require('../models/user');
exports.getUserLogin = (req, res, next) => {
    if(!req.session.User){
        res.render("./user/login");
    }else{
        res.redirect('/');
    }
    
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

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            // Handle invalid user
            return res.redirect('/users/login');
        }

        const isPasswordValid = await user.checkPassword(password);

        if (isPasswordValid) {
            req.session.user = user._id;
            // Redirect to success route
            return res.redirect('/');
        } else {
            // Handle invalid password
            return res.redirect('/users/login');
        }
    } catch (error) {
        // Handle error
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
