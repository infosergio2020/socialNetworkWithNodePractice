const jwt = require('jsonwebtoken');
function sing(data){
    let token = jwt.sign( data, 'secreto');
    return token;
}

module.exports = {
    sing,
}