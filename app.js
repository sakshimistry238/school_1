const express = require('express');
const connection = require("./helper/db")
const bodyParser = require('body-parser');
const bcryptjs = require("bcryptjs");
const { Jwt } = require("./helper/jwt");
const dotenv = require("dotenv");
var midway = require('./helper/middleware');
const Routes = require('./routes');
const auth = require("./authenticate")
dotenv.config();
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use("/School",Routes)
app.use("/auth",auth)
// API endpoint to sign up


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});