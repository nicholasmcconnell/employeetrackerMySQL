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
});
connection.query = util.promisify(connection.query);

//CONTROL FUNCTIONS
async function start() {
  try {
 
    const action = await initialPrompt();

    switch (action.action) {
      case "add employee":
        await createEmployee();
        startEnd();
        break;
      case "view all employees":
        await viewEmployees();
        startEnd();
        break;
      case "view all departments":
        await viewDept();
        startEnd();
        break;
      case "view all roles":
        await viewRoles();
        startEnd();
        break;
      case "add role":
        await createRole();
        startEnd();
        break;
      case "add department":
        await createDept();
        startEnd();
        break;
      case "update employee role":
        console.log("11111111");
        await employeeRoleUpdate();
   
        break;
      case "exit":
        startEnd();
        break;
      default:
        startEnd();

    }

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
      "view all departments",
      "view all roles",
      "add employee",
      "add role",
      "add department",
      "update employee role",
      "exit"]
  })
  return action;
}
//VIEW
async function viewEmployees() {
  try {

    return await connection.query(`SELECT * FROM employee`).then(res => {
      console.table(res)
      return res;

    });

    // let query = connection.query(`SELECT * FROM employee`,

    //   function (err, res) {
    //     if (err) throw err;
    //     console.log(`${res}`)
    // startEnd();

    //   })
  } catch (err) {
    console.log(err)
  }
};

async function viewDept() {
  try {

    return await connection.query(`SELECT name FROM department`).then(res => {
      console.table(res)
      return res;

    });

  
  } catch (err) {
    console.log(err)
  }
}

async function viewRoles() {
  try {

    return await connection.query(`SELECT title FROM role`).then(res => {
      console.table(res)
      return res;

    });

  } catch (err) {
    console.log(err)
  }
}

//ADD EMPLOYEE
async function createEmployee() {
  try {

    const managers = await getManagers();

    await inquirer.prompt([
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

      console.log("1111111" + answer.role);

      const roleID = getRoleID(answer.role);

      console.log("44444" + roleID)
      console.log(roleID)

      const employee = {
        first_name: answer.first_name,
        last_name: answer.last_name,
        role_id: roleID,
        manager_id: answer.manager_id
      }
     
      
      addEmployee(employee)
    })
  } catch (err) {
    console.log(err);
  }
}

function addEmployee(employee) {

  let query = connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
      ('${ employee.first_name}', '${employee.last_name}', ${employee.role_id}, ${employee.manager_id});`,

    function (err, res) {
      if (err) throw err;
      console.log("Employee Added!")

    })
}
//UPDATE ROLE
async function employeeRoleUpdate() {
  try {
 
    const employees = await getEmployee();
    const roles = await getRole();

    await inquirer.prompt([
      {
        name: "employee",
        type: "list",
        message: "Choose an employee to update:",
        choices: employees.map(employee => ({ name: employee.first_name + employee.last_name, value: employee.id }))
      },
      {
        name: "role",
        type: "list",
        message: "Choose an role:",
        choices: roles.map(role => ({ name: role.title, value: role.id }))
      }

    ]).then(function (answer) {

      let role = answer.role;
      let employee = answer.employee;
      newRole(employee, role);

    })

  } catch (err) {
    console.log(err);

  }
}

function newRole(employee, role) {
  let query = connection.query(`UPDATE employee set role_id = ${role} WHERE id=${employee};`,

    function (err, res) {
      if (err) throw err;
      console.log("Role Updated!");

    })
  startEnd();
};

async function createRole() {
  try {

    const departments = await getDept();

    await inquirer.prompt([
      {
        name: "new_role",
        type: "input",
        message: "Enter new role: ",
      },
      {
        name: "salary",
        type: "number",
        message: "Enter new roles salary:  "
      },
      {
        name: "department",
        type: "list",
        message: "What is the new roles department?",
        choices: departments.map(department => ({ name: department.name, value: department.id }))
      }

    ]).then(function (answer) {

      let role = answer.new_role;
      let deptId = answer.department;
      let salary = answer.salary;
    
      addRole(role, salary, deptId);
    })
  } catch (err) {
    console.log(err);
  }
}

async function addRole(role, salary, deptId) {
 
  let query = connection.query(`INSERT INTO role (title, salary, department_id) VALUES 
      ('${role}', '${salary}', ${deptId});`,

    function (err, res) {
      if (err) throw err;
      console.log("Role Added!")
      // startEnd();

    })
}

async function createDept() {
  try {

    await inquirer.prompt([
      {
        name: "new_dept",
        type: "input",
        message: "Enter new department: ",
      }
    ]).then(function (answer) {

      let dept = answer.new_dept
      addDept(dept);
    })
  } catch (err) {
    console.log(err);
  }
}

function addDept(dept) {
  let query = connection.query(`INSERT INTO department (name) VALUES 
      ('${dept}');`,

    function (err, res) {
      if (err) throw err;
      console.log("Department added!")
      // startEnd();

    })
}
//START/END
async function startEnd() {
  try {
    inquirer.prompt([
      {
        name: "continue",
        type: "list",
        message: "Would you like to return 'home'? (Selecting now will close the application.)",
        choices: ["Yes",

          "No"]
      }

    ]).then(function (answer) {

      if (answer.continue === 'Yes') {
        start();
      } else {
        connection.end();
      }
    })
  } catch (err) {
    console.log(err);
  }
};

function getRoleID(roleAnswer) {
  // try {
  //   console.log("2222222" + roleAnswer);
  //    return await connection.query(`SELECT id FROM role WHERE title = '${roleAnswer}'`).then(res => {
  //      console.log("333333" + res.id)
  //      console.log(res)
  //     return res;
  //   });

  // } catch (err) {
  //   console.log(err);
  // }

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

/////GET'S
async function getManagers() {
  try {

    return await connection.query('SELECT id, first_name, last_name FROM employee WHERE role_id = 2').then(res => {
      return res;

    });

  } catch (err) {
    console.log(err);
  }

};

async function getDept() {
  try {

    return await connection.query('SELECT id, name FROM department').then(res => {
      return res;

    });

  } catch (err) {
    console.log(err);
  }

};

async function getEmployee() {
  try {

    return await connection.query('SELECT id, first_name, last_name FROM employee').then(res => {
      return res;

    });

  } catch (err) {
    console.log(err);
  }

};

async function getRole() {
  try {

    return await connection.query('SELECT id, title FROM role').then(res => {
      return res;

    });

  } catch (err) {
    console.log(err);
  }

}

