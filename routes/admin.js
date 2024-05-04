const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const jwt = require('jsonwebtoken');
const { Admin, Course } = require("../db");
const secretKey = require("../config");
const router = Router();

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    //check if a user with this username already exist
    const adminCheck = await Admin.findOne({
        username: username,
    })
    if(adminCheck){
        return res.status(403).json({
            msg: "Admin exist already with this username"
        })
    }else{
        await Admin.create({
            username: username,
            password: password
        })
    }

    res.json({
        msg: "admin created succesfully"
    })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const adminValid = await Admin.findOne({
        username: username,
        password: password
    })

    if(adminValid){
        const token = jwt.sign({username}, secretKey);

        res.json({
            token
        })
    }else{
        res.status(403).json({
            msg: "incorrect email and pass"
        })
    }

});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.imageLink;
    const price = req.body.price;

    const findCourse = await Course.findOne({//check that course with same credentials is available or not
        title: title,
        description: description,
        imageLink: imageLink
    })

    if(findCourse){//if same course exist then just return from the procedure of creating a new course
        return res.json({
            msg: "Same Course already exist"
        })
    }

    const newCourse = await Course.create({
        title: title,
        description: description,
        imageLink: imageLink,
        price: price
    })

    res.json({
        msg: "course created succesfully",
        courseId: newCourse._id
    })
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const response = await Course.find({});

    res.json({
        courses: response
    })
});

module.exports = router;