const User = require('../models/User')
const schema = require('../helpers/userValidation');


async function signup({username, password}){
    const valid = schema.validate({username, password});
    
    if(valid){
        const exist = await User.findOne({username});
        if(exist){
            throw "User already exist"
        }
        const user = await User.create({username, password});
        return user;
    }
    throw "Validation error"
}

async function login({username, password}){
    const valid = schema.validate({username, password});
    
    if(valid){
        const user = await User.login(username, password)
        return {
            _id: user._id,
            username: user.username
        }
    }
    throw "Validation error"
}

module.exports = {
    signup, login
}