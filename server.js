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
connection.query = util.promisify(connection.query);

//datatpase query for rolls and managers

async function start() {
  try {
    //get roles
    //  await getManagers();
    // console.log(managers);
    const action = await initialPrompt();

    switch (action.action) {
      case "add employee":
        createEmployee();
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

async function createEmployee() {
  try {

    const managers = await getManagers();

    inquirer.prompt([
      {
        name: "first_name",
        type: "input",
        message: "First Name:",
      },
      {
        name: "last_name",
        type: "input",
        message: "Last Name:",
      },
      {
        name: "role",
        type: "list",
        message: "What is this employee's role?",
        choices: ["Sales Person",
          "Lead Engineer",
          "Software Engineer",
          "Manager",
          "Accountant"]
      },
      {
        name: "manager_id",
        type: "list",
        message: "Choose a manager:",
        choices: managers.map(manager => ({ name: manager.first_name + manager.last_name, value: manager.id }))
      }

    ]).then(function (answer) {

      console.log(answer.role);

      const roleID = getRoleID(answer.role);

      const employee = {
        first_name: answer.first_name,
        last_name: answer.last_name,
        role_id: roleID,
        manager_id: answer.manager_id
      }
      // console.log(employee);
     `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (${employee.first_name}, ${employee.last_name}, ${employee.role_id}, ${employee.manager_id});`;
     
     addEmployee(employee)
    })
  } catch (err) {
    console.log(err);
  }
}

function addEmployee(employee){
  console.log(employee);

  var query = connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (${employee.first_name}, ${employee.last_name}, ${employee.role_id}, ${employee.manager_id});`,
  
  function(err, res) {
      if (err) throw err;
      console.log("Employee Added!")
     
    })
}

function getRoleID(roleAnswer) {

  // console.log(`111111 ${roleAnswer}`)

  switch (roleAnswer) {
    case "Lead Engineer":
      return 1;
    case "Manager":
      return 2;
    case "Sales Person":
      return 3;
    case "Accountant":
      return 4;
    case "Software Engineer":
      return 5;
    default:
      break;
  }
};

async function getManagers() {
  try {

    return await connection.query('SELECT id, first_name, last_name FROM employee WHERE role_id = 2').then(res => {
      return res;

    });

  } catch (err) {
    console.log(err);
  }

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
