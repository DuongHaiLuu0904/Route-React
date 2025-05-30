const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

module.exports.connect = async () => {    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database');
    } catch (error) {
        console.log('Error connecting to database');
        console.log(error);
    }
}

module.exports.JWT_SECRET = JWT_SECRET;
