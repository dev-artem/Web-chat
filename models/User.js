const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre('save', function(next){
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, salt)
    next();
})

userSchema.statics.login = async function(username, password){
    const user = await this.findOne({username});

    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw "Incorrect password"
    }
    throw "Incorrect user"
}

module.exports = model('User', userSchema);