const express = require('express');
const router = new express.Router();
const User = require('../models/user');



router.post('/register', async(req, res) => {
    try {

        if (req.body.password === req.body.cpassword) {
            const employeeRegister = new User.insert({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                age: req.body.age,
                phone: req.body.phone,
                password: req.body.password,
                cpassword: req.body.cpassword
            })
            const result = await employeeRegister.save();
            res.status(201).send(result);

        } else {
            res.send("Password mismatching error");
        }


    } catch (err) {
        console.log(err);
        console.log("error in posting to database");
        res.status(400).send(err);
    }
})

module.exports = router;