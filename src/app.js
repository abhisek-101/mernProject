require('dotenv').config()
const express = require('express');
const path = require('path');
const hbs = require('hbs');
require("./db/conn");
const bcrypt = require('bcryptjs');
const app = express();
const port = process.env.PORT || 3000;
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth')



const static_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
app.use(express.static(static_path));
app.set('view engine', 'hbs');
app.set('views', views_path);
hbs.registerPartials(partials_path);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render("index");
})
app.get('/secret', auth, (req, res) => {
    console.log(`This is the secret key : ${req.cookies.jwt}`);
    res.render("secret");
})

app.get('/login', (req, res) => {
    res.render("login");
})
app.get('/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((elem) => {
                return elem.token !== req.token;
            })
            // req.user.tokens = [];

        res.clearCookie("jwt");
        console.log("Logout successfully");
        await req.user.save();
        res.render("login");
    } catch (err) {
        res.status(500).send(err);
    }
})

app.get('/register', (req, res) => {
    res.render('index');
})

const hashpwd = async(pwd) => {
    try {
        const pwd = await bcrypt.hash(pwd, 10);
        return pwd;
    } catch (err) {
        console.log("Unable to hash the password");
    }
}
app.post('/login', async(req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;
        const userEmail = await User.findOne({ email: email });

        const isMatch = await bcrypt.compare(password, userEmail.password);

        const token = await userEmail.generateAuthToken();

        res.cookie("jwt", token.toString(), {
            expires: new Date(Date.now() + 300000),
            httpOnly: true
        });


        if (isMatch) {
            console.log("login successful");
            console.log(userEmail);
            res.status(201).render("index");
        } else {
            res.send("Password isn't matching");
        }


    } catch (err) {
        res.status(400).send("cannot fetch data from the database: email not matching");
    }
})

app.post('/register', async(req, res) => {
    try {

        if (req.body.password === req.body.cpassword) {

            const employeeRegister = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                age: req.body.age,
                phone: req.body.phone,
                password: req.body.password,
                cpassword: req.body.cpassword
            })

            const token = await employeeRegister.generateAuthToken();

            res.cookie("jwt", token.toString(), {
                expires: new Date(Date.now() + 30000),
                httpOnly: true
            });

            const result = await employeeRegister.save();
            res.status(201).render("login");

        } else {
            res.send("Password mismatching error");
        }


    } catch (err) {
        console.log(err);
        console.log("error in posting to database");
        res.status(400).send(err);
    }
})

app.listen(port, () => {
    console.log(`Successfully listened at port no ${port}`)
})