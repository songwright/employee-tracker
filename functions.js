function viewAllEmployees() {
  console.log("All employees")
  connection.query("SELECT * from employee", function(error, res) {
    console.log(res);

  })
}

module.exports = {
  viewAllEmployees: viewAllEmployees
}