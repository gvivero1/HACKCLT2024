// At the top of your file, ensure you're loading environment variables if you're using a .env file
require('dotenv').config();

const Job = require('../models/job');
const User = require('../models/user');
const Blueprint = require('../models/blueprint');
const { OpenAI } = require("openai");




// Show all blueprints
exports.index = async (req, res) => {
    // Attempt to fetch the user
    let user = await User.findById(req.session.user); // get current user

    // Check if user was found before proceeding
    if (!user) {
        // Handle the case when the user is not found.
        return res.status(404).send('User not found');
    }

    const openai = new OpenAI();
    try {
        async function main() {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful recruiter incharge of helping users get a blueprint on how to get a specific job, provide specific steps that are normally unnoticed. You are supposed to output the steps as keys in a json object. Here is a blueprint and follow the format and provide specific details: Step 1 - Referals, Step 2 - Projects and Improving resume, Step 3 - provide detailed keyword for the resume and update it, Step 4 - Use referral and apply (provide a specifc message to reach out), Step 5 - Interview Prep - provide behavorial and technical job specifc questions"
                    },{role: "system", content: "Use the Blueprint above and provide in depth examples and details for the user to get the job, use the info the user provides below. Provide Super Detailed Steps with Examples"},
                    { role: "user", content: "Job Description: Software Engineer at Google" },
                    { role: "user", content: "Previous Experience:Undergraduate Research Assistant Charlotte, NC\n" +
                            "September 2023 - Present\n" +
                            "Currently conducting research in education and health settings, identifying and addressing critical problems using Agile\n" +
                            "methodology.\n" +
                            "Actively developing web and mobile applications with Django Rest Framework and React to improve efficiency and user\n" +
                            "experience.\n" +
                            "Managing ongoing project tasks and progress with Git and Jira, ensuring timely delivery.\n" +
                            "Continuously creating and maintaining a PostgreSQL Database to securely manage essential data.\n" +
                            "Presenting research findings and prototypes to academic stakeholders, contributing to real-world solutions." },
                    { role: "user", content: "Skills: Languages\n" +
                            "Frameworks\n" +
                            "Databases\n" +
                            "Java, Python, JavaScript, HTML, CSS\n" +
                            "React, Django\n" +
                            "SQLite, PostgreSQL, mySQL" },
                ],
                model: "gpt-3.5-turbo-0125",
                response_format: { type: "json_object" },
            });

            console.log(completion.choices[0].message.content);
        }

        await main();

    } catch (error) {
        console.error("Error calling OpenAI:", error);
        // Optionally handle the OpenAI API call error, e.g., by logging or sending a specific response
    }

    // If user is found, proceed with fetching blueprints
    let blueprintIds = user.blueprintIds; // get the list of the user's blueprint ids
    let blueprints = await Promise.all(blueprintIds.map(id => Blueprint.findById(id)));

    // Render the page with the blueprints
    res.render('blueprints/index', { blueprints });
};

// show one specific blueprint
exports.show = (req, res, next) => {
    let blueprintId = req.params.id;
    Blueprint.findById(blueprintId).then((blueprint) => {
        if(blueprint){
            res.render('/blueprints/show', blueprint)
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
    res.render('blueprints/create');
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

