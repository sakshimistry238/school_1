const jwt = require('jsonwebtoken');
class Jwt {
    /*
    * getAuthToken
    */
    static getAuthToken(data) {
        return jwt.sign(data,"SCHOOLAPP123", { expiresIn: "7d" });
    }
    /*
    * decodeAuthToken
    */
    static decodeAuthToken(token) {
        if (token) {
            try {
                return jwt.verify(token,"SCHOOLAPP123");
            }
            catch (error) {
                // logger.error(error);
                return false;
            }
        }
        return false;
    }
    static getDatafromToken(token) {
        if (token) {
            try {
                return jwt.decode(token, { complete: true });
            }
            catch (error) {
                return false;
            }
        }
        return false;
    }
}
module.exports = { Jwt };