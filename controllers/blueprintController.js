const Job = require('../models/job');
const User = require('../models/user');
const Blueprint = require('../models/blueprint');

//show all blueprints
exports.index = async (req, res) => {
    let user = await User.findById(req.session.user); // get current user
    let blueprintIds = user.blueprintIds; // get the list of the user's blueprint ids
    let blueprints = new [Blueprint]; // assign new array of blueprints
    for(let i = 0; i < blueprintIds.length; i++){
        Blueprint.findById(blueprintIds[i]).then((blueprint) => {
            blueprints.push(blueprint); // find all the user's blueprints and add them to the created array
        });
    }
    res.render('/blueprint/index', blueprints); // render the page of list of blueprints and pass the blueprints array
};

// show one specific blueprint
exports.show = (req, res, next) => {
    let blueprintId = req.params.id;
    Blueprint.findById(blueprintId).then((blueprint) => {
        if(blueprint){
            res.render('/blueprint/show', blueprint)
        } else{
            let err = new Error("Blueprint not found");
            err.status = 404;
            next(err);
        }
    });
};

exports.addBlueprint = async (req, res, next) => {
    
    const { jobId, experiences } = req.body;   
    const blueprint = new Blueprint({jobId, experiences});

    console.log(blueprint);

    try {
        await blueprint.save();
        // Flash Success 
        req.flash('success', 'Account has been created');
        res.redirect('/users/login');
    } catch (error) {
        res.status(500).json({ error });
    }

};
