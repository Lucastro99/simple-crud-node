//data init
const express = require('express');
const bodyParse = require('body-parser');
const mysql = require('mysql');
const handlebars = require('express-handlebars');
const app = express();
const urlencodeParser = bodyParse.urlencoded({ extended: false });
const sql = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    port: 3306
});
sql.query("use nodejs");

//template engine
app.engine("handlebars", handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//css, js and img
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
// app.use('/img', express.static('img'));

//routes and templates
app.get("/", function(req, res) {
    // res.send("essa é minha pagina incialx");
    // res.sendFile(__dirname + "/index.html");
    res.render('index');
});

app.get("/inserir", function(req, res) {
    res.render("inserir");
});

app.get("/select/:id?", function(req, res) {
    if (!req.params.id) {
        // res.send("existe");
        sql.query("select * from user order by id asc", function(err, results, fields) {
            res.render('select', { data: results });
        });
    } else {
        sql.query("select * from user where id=? order by id asc", [req.params.id], function(err, results, fields) {
            res.render('select', { data: results });
        });
    }
});

app.get("/delete/:id", function(req, res) {
    sql.query("delete from user where id=?", [req.params.id]);
    res.render('delete');
});

app.get("/update/:id", function(req, res) {
    sql.query("select * from user where id=?", [req.params.id], function(err, results, fields) {
        res.render('update', { id: req.params.id, name: results[0].name, age: results[0].age });
    });
});

app.post("/controllerUpdate", urlencodeParser, function(req, res) {
    sql.query("update user set name=?, age=? where id=?", [req.body.name, req.body.age, req.body.id]);
    res.send("Dados Atualizados com Sucesso!")
});

app.post("/controllerForm", urlencodeParser, function(req, res) {
    console.log(req.body);
    sql.query("insert into user values (?, ?, ?)", [req.body.id, req.body.name, req.body.age]);
    res.render("controllerForm", { name: req.body.name });
});

app.get("/teste/:id?", function(req, res) {
    console.log(req.params.id);
    res.render('index2', { id: req.params.id });
});

//css and js routes
// app.get("/javascript", function(req, res) {
//     res.sendFile(__dirname + "/js/javascript.js")
// })

// app.get("/style", function(req, res) {
//     res.sendFile(__dirname + "/css/style.css")
// })

//start server
app.listen(3000, function(req, res) {
    console.log('Servidor esta rodando!');
})