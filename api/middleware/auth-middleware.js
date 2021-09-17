const Users = require('../users/users-model');


async function checkUsernameFree(req, res, next) {
    try {
        const usernameFree = await Users.findBy({ username: req.body.username})
        if (!usernameFree.length) {
        next()
        } else {
        next({ status: 422, message: 'username taken'})
        }
    } catch (err) {
    next(err)
}}

function validatePayload(req,res,next){
    const { username, password } = req.body;
    if (!username || !password) {
        next({status:422,message:'username and password required'})
    } else {
        next()
    }
}

const checkUsernameExists = async (req, res, next) => {
    try {
      const usernameExists = await Users.findBy({ username: req.body.username})
      if (usernameExists.length) {
        req.user = usernameExists[0]
        next()
      } else {
        next({ status: 422, message: 'invalid credentials'})
      }
    } catch (err) {
      next(err)
    }
}

module.exports = {
validatePayload,
checkUsernameFree,
checkUsernameExists
}