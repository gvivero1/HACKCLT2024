const Job = require('../models/job');
const User = require('../models/user');
const Blueprint = require('../models/blueprint');

const blueprintId = "";

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

exports.showJob = async (req, res) => {
    res.render('/job');
};


exports.createJob = async (req, res, next) => {
    const { position, description, qualifications } = req.body;
    let job = new Job({position, description, qualifications});
    let id = job._id;
    let blueprint = await Blueprint.findById(blueprintId);
    blueprint.jobId = id;

    console.log(job);
    console.log(blueprint);

    try {
        await job.save();
        await blueprint.save();
        // Flash Success 
        req.flash('success', 'Job added');
        res.redirect('/loading');
    } catch (error) {
        res.status(500).json({ error });
    }

};

exports.showStart = async (req, res) => {
    res.render('/start');
};

exports.start = async (req, res, next) => {
    const blueprintName = req.body.blueprintName;
    let user = User.findById(req.session.user);
    let experiences = user.experiences;
    const bp = new Blueprint({blueprintName, experiences});
    blueprintId = bp._id;
    try {
        await bp.save();
        // Flash Success 
        req.flash('success', 'Blueprint started');
        res.redirect('/enterJob');
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.getLoading = async (req, res) => {
    res.render('/create');
    // add code to contact ai, give it context and start getting the response

};

exports.finishBlueprint = async (req, res, next) => {
    let blueprint = Blueprint.findById(blueprintId);
    // set the blueprint doc's appropriate fields to the document


    try {
        await blueprint.save();
        // Flash Success 
        req.flash('success', 'Blueprint finished');
        res.redirect('/:id');
    } catch (error) {
        res.status(500).json({ error });
    }
};

