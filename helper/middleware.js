const { Jwt } = require("./jwt");
const connection = require("./db")
let checkTokenForTeacher = async (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token) {
        const tokenInfo = Jwt.decodeAuthToken(token);
        if (tokenInfo && tokenInfo.userId) {
            if (tokenInfo.role === 'Teacher') {
                connection.query(`select * from user where  id = ${tokenInfo.userId}`, (err, result) => {
                    if (result.length > 0) {
                        req._user = result[0];
                        console.log(req._user);
                        next();
                    } else {
                        return res.status(401).json({ msg: "unautherize1" })
                    }
                });
            }
        }
        else {
            return res.status(401).json({ msg: "unautherize2" })
        }
    } else {
        return res.status(401).json({ msg: "unautherize3" })
    }
};
let checkTokenForStudent = async (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token) {
        const tokenInfo = Jwt.decodeAuthToken(token);
        if (tokenInfo && tokenInfo.userId) {
            if (tokenInfo.role === 'Parent' || tokenInfo.role === 'Student') {
                connection.query(`select * from user where  id = ${tokenInfo.userId}`, (err, result) => {
                    if (result.length > 0) {
                        req._user = result[0];
                        console.log(req._user);
                        next();
                    } else {
                        return res.status(401).json({ msg: "unautherize1" })
                    }
                });
            }
        }
        else {
            return res.status(401).json({ msg: "unautherize2" })
        }
    } else {
        return res.status(401).json({ msg: "unautherize3" })
    }
};


module.exports = {
    checkTokenForStudent: checkTokenForStudent,
    checkTokenForTeacher:checkTokenForTeacher
} 