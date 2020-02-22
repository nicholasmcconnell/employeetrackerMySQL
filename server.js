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
//CONTROL FUNCTIONS
async function start() {
  try {
    //get roles
    //  await getManagers();
    // console.log(managers);
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
        // console.log(department);
        // const deptID = getDeptID(department)
        break;
      case "view all roles":
        await viewRoles();
        startEnd();
        // console.log(department);
        // const deptID = getDeptID(department)
        break;
        case "add role":
        await createDept();
        startEnd();
        // console.log(department);
        // const deptID = getDeptID(department)
        break;
      default:
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
      "view all departments",
      "view all roles",
      "add employee",
      "add role",
,     "remove employee",
      "update employee role",
      "update employee manager",
      "exit"]
  })
  return action;
}
//VIEW EMPLOYLEE
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

    // let query = connection.query(`SELECT * FROM employee`,

    //   function (err, res) {
    //     if (err) throw err;
    //     console.log(`${res}`)
    // startEnd();

    //   })
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

    // let query = connection.query(`SELECT * FROM employee`,

    //   function (err, res) {
    //     if (err) throw err;
    //     console.log(`${res}`)
    // startEnd();

    //   })
  } catch (err) {
    console.log(err)
  }
}


async function getDept() {
  //select departement - display employes in that id
  try {
    inquirer.prompt([
      {
        name: "department",
        type: "list",
        message: "Which department would you like to view?",
        choices:
          ["Management",
            "Sales",
            "Accounting",
            "Engineering",
            "Legal"]
      }

    ]).then(function (answer) {

      let department = answer.department;
      console.log(`1111 ${department}`);
      // return departement;
      let departmentID = getDeptID(department);
      console.log("1111111");
      console.log(departmentID);

      let employees = connection.query(`SELECT * FROM employee`).then(res => {
        console.log("22222222")
        console.log(res)
        return res;

      });
      const employeeArr = [];
      //loop goes through if roleid = matching departmentid then push employee to
      for (const employee of employees) {
        switch (employee.role_id) {
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

      }









      // let departmentID = connection.query('SELECT id FROM role WHERE title=?', answer.department)
      // console.log("dept id " + departmentID);
      // connection.query("SELECT * FROM employee where role_id= ?", answer.department),
      // function (err, res){
      //   if(err) throw err;
      //   console.log(res);
      //   return
      // }
    })
  } catch (err) {
    console.log(err);
  }
}

// async function getDeptIDOLD(department) {
//   try {
//     let departmentID = connection.query('SELECT * FROM role WHERE title=?', department)
//     console.log(departmentID);


//   } catch (err) {
//     console.log(err);
//   }
// }

//ADD EMPLOYEE
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
      //  `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (${employee.first_name}, ${employee.last_name}, ${employee.role_id}, ${employee.manager_id});`;

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
      startEnd();

    })
}

async function createDept() {
  try {

    // const managers = await getManagers();

    inquirer.prompt([
      {
        name: "new_role",
        type: "input",
        message: "Enter new role: ",
      },

    ]).then(function (answer) {

      console.log(answer.new_role);

      // const employee = {
      //   first_name: answer.first_name,
      //   last_name: answer.last_name,
      //   role_id: roleID,
      //   manager_id: answer.manager_id
      // }
      // // console.log(employee);
      // //  `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (${employee.first_name}, ${employee.last_name}, ${employee.role_id}, ${employee.manager_id});`;

      // addEmployee(employee)
    })
  } catch (err) {
    console.log(err);
  }
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

function getDeptID(department) {

  switch (department) {
    case "Management":
      return 1;
    case "Sales":
      return 2;
    case "Accounting":
      return 3;
    case "Engineering":
      return 4;
    case "Legal":
      return 5;
    default:
      break;
  }
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

/////GET MANAGERS
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
