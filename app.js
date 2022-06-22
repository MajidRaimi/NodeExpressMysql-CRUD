const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { read } = require('fs');
const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    database: 'nodeCRUD'
})


connection.connect(function (err) {
    if (!!err) console.log(err + "\n\nCould Not Connect To The Database");
    else console.log("Connected To The Database")
});



app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {

    let sql = "SELECT * FROM Users";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('index', { title: "Title", users: rows });
    });


})


app.get('/edit/:userId', (req, res) => {
    let userId = req.params.userId;
    let sql = `SELECT * FROM Users WHERE ID = ${userId}`;
    console.log(sql);

    let query = connection.query(sql, (err, result) => {
        if (err) {
            console.log("Will Not Be Able To Render : " + err.message)
        }
        else {
            console.log(result[0])
            res.render('editUser', { user: result[0] })
        }
    });
});

app.post('/save', (req, res) => {
    let userData = {
        name: req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    }



    let sql = `INSERT INTO Users SET ?`

    let query = connection.query(sql, userData, (err, results) => {
        if (err) throw err;
        res.redirect("/")
    });



});

app.post('/update', (req, res) => {
    let userData = {
        name: req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    }



    let sql = `UPDATE Users SET name = '${userData.name}', email = '${userData.email}' , phoneNumber = '${userData.phoneNumber}' WHERE email = '${userData.email}'`

    let query = connection.query(sql, userData, (err, results) => {
        if (err) throw err;
        res.redirect("/")
    });



});


app.get('/delete/:userId', (req, res) => {
    let userId = req.params.userId;
    let sql = `DELETE FROM Users WHERE id = ${userId}`;
    console.log(sql)
    let query = connection.query(sql, (err, result) => {
        if (err) {
            console.log("Will Not Be Able To Render : " + err.message)
        }
        else {
            res.redirect("/")
        }
    });
});



app.get('/addUser', (req, res) => {


    res.render('addUser');


})


app.listen(3000, () => {
    console.log('Server Is Running At Port : 3000')
})


