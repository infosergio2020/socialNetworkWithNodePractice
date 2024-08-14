const auth = require('./../../../auth')

module.exports= function checkAuth(action){

    function middleWare(req,res,next){
        if(action == 'update'){
            // usuario que quiero modificar
            const owner = req.body.id;
            auth.check.own(req,owner);
            next();
        } else {
            next();
        }
    }

    return middleWare;

}

