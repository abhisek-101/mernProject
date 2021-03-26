require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connection successful to the database");
}).catch((err) => {
    console.log("Database connection error");
})