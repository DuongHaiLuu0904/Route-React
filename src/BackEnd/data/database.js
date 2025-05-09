const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        // await mongoose.connect("mongodb+srv://IamHaiLuu:4FnvsNTdEW10v60q@cluster0.e4alb.mongodb.net/simple-blog");
        await mongoose.connect("mongodb://127.0.0.1:27017/simple-blog");
        console.log('Connected to database');
    } catch (error) {
        console.log('Error connecting to database');
        console.log(error);
    }
}
