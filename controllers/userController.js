const User = require('../models/user');
const experience = require('../models/experience');
exports.getUserLogin = (req, res, next) => {
    if(!req.session.User){
        res.render("./user/login", {id: req.session.user});
    }else{
        res.redirect('/');
    }
    
};

exports.getNew = (req, res, next) => {
    res.render("./user/new", {id: req.session.user});
}

exports.postNew = async (req, res, next) => {
    //code to create a new user account
    const {email, password } = req.body;   
    const user = new User({ email, password });
    req.session.user = user._id;
    try {
        await user.save();
        res.redirect('/blueprints/job');
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
    console.log('getSkills called');
    if(req.session.user){
        console.log('user is valid');
        res.render("/users/getSkills", {id: req.session.user});
    }else{
        res.redirect('/users/logIn');
    }
    
}

exports.addSkills = async (req, res, next) => {
    const skills  = req.body.skills;
    const eduGpa = req.body.eduGpa;
    const highestEdu = req.body.highestEdu;
    let user = await User.findById(req.session.user);
    const exper = {years: req.body.years, role: req.body.role, responsibilities: req.body.responsibilities, experienceName: req.body.experienceName, location: req.body.location};
    console.log(skills);
    user.skills.push(skills);
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
exports.logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.redirect('/');
    });
};