const jwt = require('jsonwebtoken');
const Register = require('../models/user');

const auth = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const user = await Register.findOne({ _id: verifyToken._id });

        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send(err);
    }

}

module.exports = auth;