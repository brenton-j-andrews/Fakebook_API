module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        const HTML = "<h1> You need to log in to see this. </h1> <p><a href='/auth/login'> Log In </a></p>"
        res.send(HTML);
    }
}

// module.exports.isAdmin = (req, res, next) => {
  
// }