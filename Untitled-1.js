// npm i pg
const {Pool} = require('pg')
const pool = new Pool({
  user:'username',
  hostname: 'localhost',
  password:'xyz',
  database:'test',
  port: 5432
})

module.exports = pool;


//============================================================================

// const pool = require('./db')

// to get
// const users = pool.query('SELECT * FROM users');
const users = pool.query('SELECT * FROM users WHERE email = $1',[email]);

// to create
// const result = await pool.query(`INSERT INTO users (name, email) VALUES ('${name}', '${email}');`);
const InsertUser = await pool.query('INSERT INTO users ( name, email ) VALUES ($1, $2) RETURNING *', [name, email]);
// to delete
const deleteUser = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`,[id]) 

var keys=[]
var values=[]
var count=1
var updates = req.body
var id = req.params.id
for(const [key, value] of Object.entries(updates)){
  keys.push(`${key} = $${count}`)
  values.push(value)
  count++
}
values.push(id)
const query= `UPDATE users SET ${keys.join(', ')} WHERE id = $${count} RETURNING *` 
pool.query(query,values)

//================================================================================================

const express = require('express');
const sql = require('sql')
const app = express()
const port = 8090
app.use(express.json())

const DBconnection = async()=>{
  const connect = await sql.createConnection({
    host:'localhost',
    user:'suresh',
    password:'xyz',
    database:'test'
  }).connect()
  if(connect){
    console.log(`DB is connected`);
    app.listen(port,(err)=>{
      if(err){
        console.log(`Something went wrong while creating Server`);
      } else {
        console.log(`Server is running on port ${port}`);
      }
    })    
  } else {
    console.log(`Something went wrong while connecting DB`);    
  }
}
DBconnection()


var pool = require('./db')
async function updates(id,object){
  var feilds=[]
  var val=[]
  var count=1
  for(const [key,value]of Object.entries(object)){
    feilds.push(`${key} = $${count} `)
    val.push(value)
    count++
  }

  val.push(id)

  var query1 =`UPDATE users SET ${feilds.join(', ')} WHERE id = $${count} RETURNING *;`;
  await pool.query(query1,val)
}


