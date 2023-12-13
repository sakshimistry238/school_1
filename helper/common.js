const nodeMailer = require("nodemailer");
const sendEmail = async(options)=>{
    console.log(options,"optin");
const transporter = nodeMailer.createTransport({
    host:"stmp.gmail.com",
    port:465,
    service:"gmail",
    auth:{
        user:"sakshumistry238@gmail.com",
        pass:"ampzatjmstlereqd"
    }
})
const mailOption = {
    from:"sakshumistry238@gmail.com",
    to:options.email,
    subject:options.subject,
    text:options.teamessage
}
await transporter.sendMail(mailOption)
};
module.exports = sendEmail;