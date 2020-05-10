const response = require('./response');
module.exports = {
        checkAuth(req,res,next){
        if(!req.user){
        return response.error(res,401,'Unauthorized access')
        }
         else { 
                 next()
        };
},
}