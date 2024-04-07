
const Job = require('../models/job');
const User = require('../models/user');
const Blueprint = require('../models/blueprint');
const OpenAI = require("openai");
const config = require("../config")

// Show all blueprints
exports.index = async (req, res) => {
    // Attempt to fetch the user
    console.log('blueprint index called');
    let user = await User.findById(req.session.user); // get current user

    // Check if user was found before proceeding
    if (!user) {
        // Handle the case when the user is not found.
        return res.status(404).send('User not found');
    }

    // If user is found, proceed with fetching blueprints
    let blueprintIds = user.blueprintIds; // get the list of the user's blueprint ids
    let blueprints = await Promise.all(blueprintIds.map(id => Blueprint.findById(id)));

    // Render the page with the blueprints
    res.render('blueprints/index', { blueprints, id: req.session.user});
};

// show one specific blueprint
exports.show = (req, res, next) => {
    let blueprintId = req.params.id;
    Blueprint.findById(blueprintId).then((blueprint) => {
        if(blueprint){
            res.render('blueprints/show', {blueprint , id: req.session.user})
        } else{
            let err = new Error("Blueprint not found");
            err.status = 404;
            next(err);
        }
    });
};

exports.showJob = async (req, res) => {
    res.render('blueprints/job', { id: req.session.user });
};


exports.createJob = async (req, res, next) => {
    const { position, description, qualifications } = req.body;
    let job = new Job({position, description, qualifications});
    let jobId = job._id;
    let blueprint = await Blueprint.findById(req.session.bpid);
    blueprint.jobId = jobId;
    console.log('createJob called');
    console.log(job);
    console.log(blueprint);

    try {
        await job.save();
        await blueprint.save();
        res.redirect('/blueprints/create');
    } catch (error) {
        res.status(500).json({ error });
    }

};

exports.showStart = async (req, res) => {
    console.log('show start called');
    res.render('blueprints/start', { id: req.session.user });
};

exports.start = async (req, res, next) => {
    console.log('blueprint start called');
    const blueprintName = req.body.blueprintName;
    const bp = new Blueprint({blueprintName});
    req.session.bpid = bp._id;
    try {
        console.log('try save');
        await bp.save();
        console.log('bp saved');
        // Flash Success
        // req.flash('success', 'Blueprint started');
        console.log('try redirect to job');
        res.redirect('/blueprints/job');
    } catch (error) {
        console.error();
        res.status(500).json({ error });
    }
};

exports.getLoading = async (req, res) => {
    if(!req.session.user){
        console.log('user not found');
    } else{
        console.log('getLoading called');
        res.render('/blueprints/create', { id: req.session.user });
        // get necessary user and job info: skills, experiences, 
        let blueprint = await Blueprint.findById(req.session.bpid);
        let job = await Job.findById(blueprint.jobId);
        let user = await User.findById(req.session.user);

        console.log(blueprint);
        console.log(job);
        console.log(user);


        let desJobRole = "Desired job position: " + job.position;
        let desJobDesc = "Desired job's description: " + job.description;
        let desJobQual = "Desired job's required qualifications: " + job.qualifications;
        let allSkills = "";
        let allExperiences = "";

        for(let i = 0; i < user.skills.length; i++){
            allSkills += "Skill ${index + 1}: " + user.skills[i] + "\n";
        }
        
        for(let i = 0; i < user.experiences.length; i++){
            let singleExp = "Experience "+ i + ": \n";
            singleExp += "Experience Name: " + user.experiences[i].experienceName + "\n";
            singleExp += "Role: " + user.experiences[i].role + "\n";
            singleExp += "Duties: " + user.experiences[i].responsibilities + "\n";
            singleExp += "Duration: " + user.experiences[i].years + "\n";
            singleExp += "Location: " + user.experiences[i].location + "\n";
            allExperiences += singleExp;
        }
        console.log(allExperiences);

        blueprint.experiences = user.experiences;

        const openai = new OpenAI(config.apiKEY);

        try {
            async function main() {
                const completion = await openai.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful recruiter incharge of helping users get a blueprint on how to get a specific job, provide specific steps that are normally unnoticed. You are supposed to output the steps as keys in a json object. Here is a blueprint and follow the format and provide specific details: Step 1 - Referals, Step 2 - Projects and Improving resume, Step 3 - provide detailed keyword for the resume and update it, Step 4 - Use referral and apply (provide a specifc message to reach out), Step 5 - Interview Prep - provide behavorial and technical job specifc questions"
                        },{role: "system", content: "Use the Blueprint above and provide in depth examples and details for the user to get the job, use the info the user provides below. Provide Super Detailed Steps with Examples"},
                        { role: "user", content: desJobRole }, // gives desired position
                        { role: "user", content: desJobDesc }, // gives position description
                        { role: "user", content: desJobQual }, // gives position qualifications
                        { role: "user", content: allExperiences }, // gives user experiences
                        { role: "user", content: allSkills }, // gives user skills
                    ],
                    model: "gpt-3.5-turbo-0125",
                    response_format: { type: "json_object" },
                });
                console.log('ai response to follow');
                let aiResponse = completion.choices[0].message.content;
                blueprint.nextSteps = aiResponse;
                console.log(blueprint.nextSteps);
                console.log(blueprint);
                user.blueprintIds.push(blueprint._id);
            }

            await main();

        } catch (error) {
            console.error("Error calling OpenAI:", error);
            // Optionally handle the OpenAI API call error, e.g., by logging or sending a specific response
        }


        try {
            await blueprint.save();
            console.log('bp saved after ai');
            res.redirect('/create');
        } catch (error) {
            console.log('error caught when trying to redirect');
            res.status(500).json({ error });
        }
    }

};

exports.finishBlueprint = async (req, res, next) => {
    
};

