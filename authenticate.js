const express = require("express");
const router = express.Router();
const connection = require("./helper/db")
const { Jwt } = require("./helper/jwt");
var midway = require('./helper/middleware');
router.post('/signup', (req, res) => {
    const { name, email, password, photo, role } = req.body;
    connection.query(`insert into user(id,name,email,photo,password,role,school_id) values(null,'${name}','${email}','${photo}','${password}','${role}',null)`, (err, result) => {
        if (err) {
            res.json({ err: err })
        } else {
            res.status(200).json({ success: "Register User SuccessFully" })
        }
    })
});


router.post('/login', (req, res) => {
    const { email, password, role } = req.body;
    connection.query(`select * from user where email = '${email}' and role = '${role}' and password = '${password}'`, (err, result) => {
        if (err) {
            res.json({ err: err })
        } else {
            const user = result[0];
            console.log(1);
            let token = Jwt.getAuthToken({ userId: user.id, role: user.role });
            module.exports.user = {
                username: result[0].email,
                password: result[0].password,
                Uid: result[0].id
            }
            result[0].token = token;
            res.cookie('auth', token);
            return res.status(200).json({
                msg: "Welcome Back",
                data:result,
                token
            })
        }
    })
})
module.exports = router;