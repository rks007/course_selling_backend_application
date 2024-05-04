const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const jwt = require('jsonwebtoken')
const { User, Course } = require("../db");
const secretKey = require("../config");

// User Routes
router.post('/signup',  async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    // console.log(password);

    const findUser = await User.findOne({
        username: username
    })

    if(findUser){
        return res.status(403).json({
            msg: "user already exist"
        })
    }else{
        await User.create({username: username, Password: password})
    }

    // console.log(password);

    res.json({
        msg: "User created successfully"
    })

});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const userValid = await User.findOne({
        username: username
    })

    // console.log(userValid);

    if(userValid){
        const token = jwt.sign({username}, secretKey);
        res.json({
            token
        })
    }else{
        res.status(403).json({
            msg: "user not authenticated"
        })
    }
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic

    const response = await Course.find({});
    res.json({
        courses: response
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const username = req.username;//getting the username from the userMiddleware
    const courseId = req.params.courseId;

    await User.updateOne({
        username: username
    },{
        $push: {
            purchasedCourses: courseId
        }
    })

    res.json({
        msg: "course purchased"
    })

});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    //first find the username from the User database
    const user = await User.findOne({
        username: req.username//getting it from the userMiddleWare
    })

    // console.log(user.purchasedCourses);

    //Using $in is the correct approach for searching within an array of values.
    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    })

    res.json({
        courses: courses
    })
});

module.exports = router