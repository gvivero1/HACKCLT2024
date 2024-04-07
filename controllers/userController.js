const User = require('../models/user');
const experience = require('../models/experience');

exports.getIndex = (req, res, next) => {
    const currentUser = req.session.user;
    const checkUser = false;
    if(currentUser){
        checkUser = true;
        res.render("index", {checkUser});
    } else{
        res.render("index", {checkUser});
    }
    
};

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
        res.redirect('/user/login');
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
            return res.redirect('/user/login');
        }

        const isPasswordValid = await user.checkPassword(password);

        if (isPasswordValid) {
            req.session.user = user._id;
            req.session.loggedIn = true;
            // Redirect to success route
            return res.redirect('/');
        } else {
            // Handle invalid password
            req.session.loggedIn = false;
            return res.redirect('/user/login');
        }
    } catch (error) {
        // Handle error
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getSkills = (req, res, next) => {
    if(req.session.user){
        res.render("./user/getSkills");
    } else{
        res.redirect('/users/login')
    }
        
    
    
}

exports.addSkills = async (req, res, next) => {
    console.log('add skills called');
    const skills  = req.body.skills;
    const eduGpa = req.body.eduGpa;
    const highestEdu = req.body.highestEdu;
    const roles = req.body.role;
    const resps = req.body.responsibilities;
    const expNames = req.body.experienceName;
    const years = req.body.years;
    const locations = req.body.location;

    let user = await User.findById(req.session.user);
    console.log(skills);
    user.skills = skills;
    user.eduGpa = eduGpa;
    user.highestEdu = highestEdu;
    console.log(roles);
    console.log(years);
    console.log(expNames);
    console.log(locations);
    console.log(resps);

    for(let i = 0; i < locations.length; i++){
        const exper = {
            years: years[i], 
            role: roles[i], 
            responsibilities: resps[i], 
            experienceName: expNames[i], 
            location: locations[i]};
        console.log(exper);
        user.experiences.push(exper);
    }
    
    try {
        await user.save();
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ error });
    }
};
