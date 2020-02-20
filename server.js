var mysql = require("mysql");
var express = require("express");
var inquirer = require("inquirer");
const cTable = require('console.table');
const DataFunctions = require('./constructor');
var util = require('util')


// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "yourRootPassword",
  database: "trackerDB"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start();
  // const managers = getManagers();
  // console.log(`hi ${managers}`);
});

//datatpase query for rolls and managers

async function start() {
  try {
    //get roles
  //  await getManagers();
    // console.log(managers);
    const action = await initialPrompt();

    switch (action.action) {
      case "add employee":
        addEmployee();
        break;
      default:
      // code block
    }
    // if (choice.choice === "return home") {
    //   start();
    // } else {
    //   actionChooser(action.action, choice.choice);
    // }
  } catch (err) {
    console.log(err);
  }
}

async function initialPrompt() {
  let action = await inquirer.prompt({
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: ["view all employees",
      "view all employees by department",
      "view employees by manager",
      "add employee",
      "remove employee",
      "update employee role",
      "update employee manager",
      "exit"]
  })
  return action;
}

function viewEmployees() {
  //list employees
}

function viewEmployeesByDept() {

}
// const manager = connection.query('SELECT id, first_name, last_name FROM employee WHERE role_id = 2', function(err, res){
//     // console.log(res)
//     // let id = res[0];
//     // console.log();
// });
// console.log(manager);

async function addEmployee() {

  // const stringify = JSON.stringify(connection.query('SELECT id, first_name, last_name FROM employee WHERE role_id = 2'));
  // const
  let managers = await getManagers();
  console.log("inadd emp " + managers);
  // // inquirer.prompt([
  //   {
  //     name: "first_name",
  //     type: "input",
  //     message: "First Name:",
  //   },
  //   {
  //     name: "last_name",
  //     type: "input",
  //     message: "Last Name:",
  //   },
  //   {
  //     name: "role",
  //     type: "list",
  //     message: "What is this employee's role?",
  //     choices: [ "Salesperson", 
  //     "Lead Engineer", 
  //     "Software Engineer", 
  //     "Manager", 
  //     "Accountant"]
  //   },
  //   // {
  //   //   name: "manager_id",
  //   //   type: "list",
  //   //   message: "Choose a manager:",
  //   //   choices: managers.map(manager => ({name: manager.first_name + manager.last_name, value: manager.id}))
  //   // }

  // ]).then(function (answer) {
  //   // const roleID = cms.getRoleID(answer.role);

  //   const employee = {
  //     first_name: answer.first_name,
  //     last_name: answer.last_name,
  //     role_id: roleID,
  //     manager_id: answer.manager_id
  //   }
  //   // console.log(cms.addEmployee(employee));
  //   return employee;
  // })
}

async function getManagers() {
  let res = await connection.query('SELECT id, first_name, last_name FROM employee WHERE role_id = 2', function (err, res) {
    // return(res);
  });

  console.log("hi " + res);
  // const query = connection.query('SELECT id, first_name, last_name FROM employee WHERE role_id = 2');
  // let string = JSON.stringify(query);
  // const parse = JSON.parse(string);
  // // const managers = parse;
  // console.log(parse);

};

function removeEmployee() {

}

function updateEmployeeRole() {

}

function updateEmployeeManager() {

}

function choicePrompt() {
  switch (choice) {
    case x:
      // code block
      break;
    case y:
      // code block
      break;
    default:
    // code block
  }
}


// 
// console.log(connection.query('SELECT id, first_name, last_name FROM employee WHERE role_id = 2', ));
