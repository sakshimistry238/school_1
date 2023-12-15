const express = require("express");
const connection = require("./helper/db")
const { Jwt } = require("./helper/jwt");
const sendEmail = require("./helper/common")
const router = express.Router();
var midway = require('./helper/middleware');
router.post('/createSchool',midway.checkTokenForTeacher, (req, res) => {
    const { name, photo, userid } = req.body;
    const {id}= req._user
    connection.query(`insert into school(id,name,photo,userid) values(null,'${name}','${photo}','${id}')`, (err, result) => {
        if (err) {
            res.json({ err: err })
        } else {
            res.status(200).json({ success: "School created SucessFully" })
        }
    })
})
router.post('/getMySchool',midway.checkTokenForTeacher, (req, res) => {
    const { userid } = req.body;
    connection.query(`select s.*,u.role from school s join user u on s.userid = u.id  where userid = '${userid}'`, (err, result) => {
        if (err) {
            res.json({ err: err })
        } else {
            res.status(200).json({ data: result })
        }
    })
})
router.post('/CreateClass', midway.checkTokenForTeacher,async(req, res) => {
    const { name, school_id, student_id } = req.body;
    const {email}=req._user 
   
    let invitecodeTeacher = Math.floor(100000 + Math.random() * 900000);
    let invitecodeParent= Math.floor(100000 + Math.random() * 900000);
    const teamessage = `Dear Teacher, Invite Code For the Class is ${invitecodeTeacher}`;
    const stumessage = `Dear Parent, Invite Code For the Class is ${invitecodeParent}`;
    connection.query(`select user_id from student where id = '${student_id}'`, (err, result) => {
        if (err) {
            res.json({ err: err });
        } else {
            connection.query(`insert into class(id,name,school_id,student_id,invitecodeTeacher,invitecodeParent) values(null,'${name}','${school_id}','${student_id}','${invitecodeTeacher}','${invitecodeParent}')`, async (err, result) => {
                if (err) {
                    res.json({ err: err })
                } else {
                    await sendEmail({
                        email: email,
                        subject: `Invite Code For The Teacher`,
                        teamessage,
                      });
                    //   await sendEmail({
                    //     email: result[0].user_id,
                    //     subject: `Invite Code For The Parent`,
                    //     stumessage,
                    //   });
                    res.status(200).json({ msg:"Class Created SuccessFully" })
                }
            })
         }
    })
    
})

router.post('/getClasses',midway.checkTokenForTeacher, (req, res) => {
    const { school_id } = req.body;
    connection.query(`select * from class where school_id = '${school_id}'`, (err, result) => {
        if (err) {
            res.json({ err: err })
        } else {
            res.status(200).json({ data: result })
        }
    })
})
router.post('/CreateStudent', midway.checkTokenForTeacher,(req, res) => {
    const { name, school_id, photo, userid } = req.body;
    connection.query(`insert into student(id,name,photo,school_id,user_id) values(null,'${name}','${photo}','${school_id}','${userid}')`, (err, result) => {
        if (err) {
            res.json({ err: err })
        } else {
            res.status(200).json({ msg:"Student Created SuccessFully"})
        }
    })
})
router.post('/getstudents',midway.checkTokenForTeacher, (req, res) => {
    const { school_id } = req.body;
    connection.query(`select * from student where school_id = '${school_id}'`, (err, result) => {
        if (err) {
            res.json({ err: err })
        } else {
            res.status(200).json({ data: result })
        }
    })
})
router.post('/AssignStuToClass', midway.checkTokenForTeacher,(req, res) => {
    const { class_id, student_id } = req.body;
    connection.query(`insert into assign_class(id,class_id,student_id) values(null,'${class_id}','${student_id}')`, (err, result) => {
        if (err) {
            res.json({ err: err })
        } else {
            res.status(200).json({ msg:"Class Assigned SuccessFully" })
        }
    })
})
router.post('/getClassMatesOfStu',midway.checkTokenForTeacher, (req, res) => {
    const { student_id } = req.body;
    connection.query(`SELECT a.class_id FROM student s join assign_class a on s.id = a.student_id where s.id = '${student_id}';`,(err,result)=>{
        let classIds = result.map(obj => obj.class_id);
        console.log(classIds,"ij");
        connection.query(`select s.name from assign_class a left join student s on a.student_id = s.id where a.class_id In (${classIds}) group by s.id;`, (err, result) => {
            if (err) {
                res.json({ err: err })
            } else {
                console.log(result);
                res.status(200).json({ data: result })
            }
        })
    })
    
})
router.get('/getStudentOfAllClass',midway.checkTokenForTeacher, (req, res) => {
    connection.query(`select id from class`,(err,result)=>{
        console.log(result);
        let classIds = result.map(obj => obj.id);
        console.log(classIds);
        connection.query(`select s.name from assign_class a left join student s on a.student_id = s.id where class_id In('${classIds}') group by s.id;`, (err, result) => {
            if (err) {
                res.json({ err: err })
            } else {
                console.log(result);
                res.status(200).json({ data: result })
            }
        })
    })
   
})
module.exports = router;