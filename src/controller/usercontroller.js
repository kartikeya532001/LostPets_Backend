const pool = require('../../db_connect')

const addUser = (req, res) => {
  
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const phonenumber = req.body.phonenumber
  if(name == null || email == null || password == null || phonenumber == null)
  {
    res.json({"success":false, "message": "empty field"})
  }
  else{
    pool.query('INSERT INTO users ( name, email, password, phonenumber) VALUES ($1, $2, $3, $4) RETURNING *', [name, email, password, phonenumber], (error, results) => {
      if (error) {
        res.json({"success":false, "message": error.detail})
        throw error
      }
      res.status(201).json({"success": true, "message": "User Added Successfully", "u_id": results.rows[0].u_id })
    })
  }
}

const updateUser = (req, res) => {
  //update based on u_id
  //const { u_id, name, email, password, phonenumber  } = req.body
  const u_id = req.body.u_id
  const name = req.body.name
  const phonenumber = req.body.phonenumber

  pool.query('SELECT * FROM users WHERE u_id = $1', [u_id], (error, results) => {
    if (error) {
      throw error
    }
    if(results.rowCount == 0)
      res.status(200).json({"success": false, "message": "User not found"})
    else
    {
      pool.query('UPDATE users SET name = $2, phonenumber = $3 WHERE u_id = $1 ', [u_id, name, phonenumber], (error, results) => {
          if (error) {
            res.json({"success":false, "message": error})
            throw error
          }
          res.status(201).json({"success": true, "message": "User Updated Successfully", "u_id": u_id })
        })
    }
  })
}

const getUsers = (req, res) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json({"success": true, "rows": results.rows})
  })
}

const getUserById = (req, res) => {
  const u_id = parseInt(req.params.u_id)
  console.log("Called");
  pool.query('SELECT * FROM users WHERE u_id = $1', [u_id], (error, results) => {
    if (error) {
      throw error
    }
    if(results.rowCount == 0)
      res.status(200).json({"success": false, "message": "User not found"})
    else
      res.status(200).json({"success": true, "rows" : results.rows})
  })
}

const emailExists = (req, res) => {
  const email = req.body.email
  
  if(email == '')
  {
    res.json({"success":false, "message": "empty field"})
  }
  else{
   
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error
    }
    if(results.rowCount == 0)
      res.status(200).json({"success": false, "message": "Email Doesnt exist"})
    else
      res.status(200).json({"success": true, "message": "Email Already exists"})
    })
  }
}

const verifyPassword = (req, res) => {
  const email = req.body.email
  const password = req.body.password
  console.log(email)
  console.log(password)
  pool.query('SELECT password, u_id FROM users WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error
    }
    
    if(results.rowCount == 0)
      res.status(200).json({"success": false, "message": "Email Doesnt exist"})
    else if(results.rows[0].password == password)
      res.status(200).json({"success": true, "message": "User Verified", "u_id": results.rows[0].u_id})
    else
      res.status(200).json({"success": false, "message": "Password Invalid"})
  })
}

module.exports = {addUser, getUsers, getUserById, emailExists, verifyPassword, updateUser}; 