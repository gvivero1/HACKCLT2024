
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
    res.render('blueprints/index', { blueprints });
};

// show one specific blueprint
exports.show = (req, res, next) => {
    let blueprintId = req.params.id;
    Blueprint.findById(blueprintId).then((blueprint) => {
        if(blueprint){
            res.render('blueprints/show', blueprint)
        } else{
            let err = new Error("Blueprint not found");
            err.status = 404;
            next(err);
        }
    });
};

exports.showJob = async (req, res) => {
    res.render('blueprints/job');
};


exports.createJob = async (req, res, next) => {
    const { position, description, qualifications } = req.body;
    let job = new Job({position, description, qualifications});
    let jobId = job._id;
    let blueprint = await Blueprint.findById(req.session.bpid);
    blueprint.jobId = jobId;

    console.log(job);
    console.log(blueprint);

    try {
        await job.save();
        await blueprint.save();
        // Flash Success
        req.flash('success', 'Job added');
        res.redirect('blueprints/create');
    } catch (error) {
        res.status(500).json({ error });
    }

};

exports.showStart = async (req, res) => {
    console.log('show start called');
    res.render('blueprints/start');
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
    console.log('getLoading called');
    res.render('/blueprints/create');
    // add code to contact ai, give it context and start getting the response
    
    const openai = new OpenAI(config.apiKEY);
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
            responseGenerated = true;
        }

        await main();

    } catch (error) {
        console.error("Error calling OpenAI:", error);
        // Optionally handle the OpenAI API call error, e.g., by logging or sending a specific response
    }
    

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

