const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){

        try {
            const decoded = jwt.verify(token, process.env.SECRET);
            next();
        } catch (error) {
            console.log(error)
            res.redirect('login');
        }
    }else{
        res.redirect('login')
    }
}

function checkUser(req, res, next){
    const token = req.cookies.jwt;
    if (token){        
        jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
            if (err){
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user.username
                next();
            }
        })
    }        
     else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };