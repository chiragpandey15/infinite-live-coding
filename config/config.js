
require('dotenv').config(); // Load environment variables


module.exports = {
    dbUri: process.env.DB_URI,
    jwtSecret: process.env.JWT_SECRET,
    port: process.env.PORT || 5000
};
