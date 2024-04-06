const Job = require('../models/job');
const User = require('../models/user');

exports.createJob = async (req, res, next) => {
    const { position, description, qualifications } = req.body;
    const job = new Job({position, description, qualifications});

    console.log(job);

    try {
        await job.save();
        // Flash Success 
        req.flash('success', 'Account has been created');
        res.redirect('/users/login');
    } catch (error) {
        res.status(500).json({ error });
    }

};