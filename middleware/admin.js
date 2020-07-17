//Middleware Function
function admin(req, res, next){
    //Check if user is admin
    if(!req.user.isAdmin){
        return res.status(403).send('Access denied');
        //401 = Unauthorized - No valid token
        //403 = Forbidden - Valid token with insufficient privileges 
    }
    next();
}

module.exports = admin;