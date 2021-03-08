const express = require('express');
const mssql = require('mssql');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(express.json());



var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"root"
    
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

//Function to connect to database and execute query or CRUD operation
var executeQuery = function (req, res) {
    mssql.connect(config, function (err) {
        if (err) {
            console.log("Error while connecting database :- " + err);
            res.send(err);
        }
        else {
            var request = new mssql.Request(); // create Request object
            request.query(req, function (err, response) { // query to the database
                if (err) {
                    console.log("Error while querying database :- " + err);
                    res.send(err);
                }
                else {
                    res.send(response);
                }
            });
        }
    });
}



// Get User roles
function getStudentinfo(name) {
    let sn = "Student name";
    let sr = "Student rollnum";
    let sm = "Student mark";

    if (name === sn) return 1;
    if (name === sr) return 2;
    if (name === sm) return 3;
}


/* ----------- User Master CRUD operations STARTS ----------- */

// Get all Users to display in Masters
app.get(`/Student-master`, verifyJWT, function (req, res) {
    var query = `SELECT id, Student_name, Student_rollnum, Student_mark FROM react.dbo.users`;
    executeQuery(query, res);
});


// Add New User to Master
app.post(`/Student-master`, verifyJWT, (req, res) => {
    const Student_name = req.body.Student_name;
    const Student_rollnum = req.body.Student_rollnum;
    const Student_mark = req.body.Student_mark;


    var checkCEStudentname = `SELECT id, Student_name FROM react.dbo.users WHERE Student_rollnum='${Student_rollnum}'`;

    mssql.connect(config).then(pool => {
        return pool.request().query(`${checkCEStudentname}`)
    }).then(sqlResults => {

       
        if (sqlResults.recordset[0].Student_name == 'Divya' || sqlResults.recordset == "") {
            res.send({ status: false, message: "Divya name already exists." });
        } else if (sqlResults.recordset[0].Student_name != 'Divya') {
           
                    const addNewStudentStmt = `INSERT INTO ${process.env.DB_react}.Students (Student_name,  Student_rollnum, Student_mark) VALUES ('${Student_name}', '${Student_rollnum}', '${Student_mark}',  '${hash}', '${Student_name}')`;
                    mssql.connect(config).then(pool => {
                        return pool.request().query(`${addStudentStmt}`)
                    }).then(successResult => {
                        res.send({ status: true });
                    }).catch(err => {
                        console.log(err);
                    });
        };
            });
        

// Delete User by ID
app.delete(`/user-master/:id`, verifyJWT, function (req, res) {
    var query = `DELETE FROM react.dbo.users WHERE id=${req.params.id}`;
    executeQuery(query, res);
});
});
/* ----------- User Master CRUD operations ENDS ----------- */
