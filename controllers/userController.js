const User = require('../models/user');
const Experience = require('../models/experience');
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

exports.getSkills = (req, res, next) => {
    res.render("./user/getSkills");
}

exports.addSkills = async (req, res, next) => {
    const skills  = req.body.skills;
    const eduGpa = req.body.eduGpa;
    const highestEdu = req.body.highestEdu;
    let user = await User.findById(req.session.user);
    const exper = new Experience(req.body.years, req.body.role, req.body.responsibilities, req.body.experienceName, req.body.location);
    
    user.skills = skills;
    user.eduGpa = eduGpa;
    user.highestEdu = highestEdu;
    user.experiences.push(exper);
    try {
        await user.save();
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ error });
    }
};
