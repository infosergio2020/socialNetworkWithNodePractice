module.exports = {
    api:{
        port: process.env.API_PORT || 3000,
    }, 
    jwt:{
        secret: process.env.JWT_SECRET || 'notasecret!',
    },
    mysql:{
        host: process.env.MYSQL_HOST || '192.168.0.102',
        user: process.env.MYSQL_USER || 'admin01',
        password: process.env.MYSQL_PASS || 'admin123',
        database: process.env.MYSQL_DB || 'social_network',
        port: process.env.MYSQL_PORT || '3306',
    }
}