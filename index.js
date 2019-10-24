// Dependencies
var express = require("express");
var mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");
var functions = require("./functions");

// // const questions = [
//   {
//     type: "input",
//     message: "View All Employeese",
//     name: "viewEmployees"
//   }
// // ];


// Create express app instance.
//var app = express();

// MySQL DB Connection Information
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "$@nchez4mysql",
  database: "employees"
});

var showroles;
var showdepartments;

// Initiate MySQL Connection.
connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);

  connection.query("SELECT * from role", function (error, res) {
    showroles = res.map(role => ({ name: role.title, value: role.id }))
  })
  connection.query("SELECT * from department", function (error, res) {
    showdepartments = res.map(dep => ({ name: dep.name, value: dep.id }))
  })

  showmenu();
})

// Show inquirer menu
function showmenu() {
  inquirer
    .prompt(
      {
        type: "list",
        message: "Welcome to Employee Tracker. What would you like to do?",
        name: "choices",
        choices: [
          {
            name: "View all employees",
            value: "viewEmployees"
          },
          {
            name: "View all departments",
            value: "viewDepartments"
          },
          {
            name: "View all roles",
            value: "viewRoles"
          },
          {
            name: "Add employee",
            value: "addEmployee"
          },
          {
            name: "Add department",
            value: "addDept"
          },
          {
            name: "Add role",
            value: "addRole"
          },
          {
            name: "Quit",
            value: "quit"
          }
        ]
      }).then(function (res) {
      // console.log(res)
      menu(res.choices)
    })
}

function menu(option) {
  switch (option) {
    case "viewEmployees":
      viewAllEmployees();
      break;
    case "viewDepartments":
      viewAllDepartments();
      break;
    case "viewRoles":
      viewAllRoles();
      break;
    case "addEmployee":
      addEmployee();
      break;
    case "addDept":
      addDept();
      break;
    case "addRole":
      addRole();
      break;
    case "quit":
      end();
  }
}

function viewAllEmployees() {
  connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", function (error, res) {
    console.table(res);
  })
}

function viewAllDepartments() {
  console.log("view all departments")
  connection.query("SELECT * from department", function (error, res) {
    console.table(res);
  })
}

function viewAllRoles() {
  connection.query("SELECT * from role", function (error, res) {
    console.table(res);
  })
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: "What is the first name?",
        name: "firstName",
      },
      {
        type: "input",
        message: "What is the last name?",
        name: "lastName",
      },
      {
        type: "list",
        message: "What is the employee's title?",
        name: "title",
        choices: showroles
      },
      // {
      //   type: "list",
      //   message: "What is the employee's department?",
      //   name: "manager",
      //   choices: showdepartments
      // }
      {
        type: "input",
        message: "What is the id of the employee's manager?",
        name: "manager",
        // choices: showdepartments
      }
    ]).then(function (response) {
      console.log(response)
      addEmployees(response)
    })
  //ask the user for all the input data
}
function addEmployees(data) {

  connection.query("INSERT INTO employee SET ?",
    {
      first_name: data.firstName,
      last_name: data.lastName,
      role_id: data.title,
      manager_id: data.manager

    }, function (error, res) {
      // console.log(res, error);
      if (error) throw error;
    })
}



// function endOrMenu() {
//   inquirer
//     .prompt([
//       {
//         type: 'input',
//         message: "Quit or continue?",
//         name: "choices",
//         choices: [
//           {
//             name: "Quit",
//             value: "quit"
//           },
//           {
//             name: "Quit",
//             value: "quit"
//           }
//         ]
//       }
//     ])
// }

function end() {
  console.log("Thank you for using Employee Tracker!")
  connection.end()
  process.exit()
}
