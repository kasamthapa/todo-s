const express =require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { getAllTodo, createTodo,deleteTodo, updateTodo, searchTodo, toggleTodo} =require('./routes/todo.js');

const app = express();
const PORT = 3001;
const SECRET_KEY = "hellokasam89";

app.use(cors());
app.use(express.json());
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')));


let users =[];

function authenticateToken(req,res,next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(!token) return res.status(401).json({msg:"NO token provided!"});
  jwt.verify(token,SECRET_KEY,(err,user)=>{
    if(err) return res.status(403).json({msg:"Invalid token!"})

      req.user = user;
      next();
  })

}


app.post("/signup",(req,res)=>{
  const username = req.body.username;
  const password = req.body.password;

  let foundUser = users.find(u => u.username == username);
  if(foundUser) return res.status(400).json({msg:"User already exists!"});
  const newUser = {
    id:users.length+1, 
    username,
    password
  }
  users.push(newUser);
  res.status(200).json({msg:"user registered successfully"});
})

app.post("/login",(req,res)=>{
  const username = req.body.username;
  const password = req.body.password;

  let foundUser = users.find(u => u.username == username && u.password == password);

  if(!foundUser) return res.status(401).json({msg:"Invalid credentials."});
  const token = jwt.sign({
    id:foundUser.id,
    username:foundUser.username,
  },SECRET_KEY,{expiresIn:"24h"});
  res.json({token});
})
app.get("/",(req,res)=>{
  res.sendFile(__dirname+'/public/index.html')
})

 
app.get("/todos",authenticateToken,getAllTodo);
app.post("/todos",authenticateToken,createTodo);
app.put("/todos/:id",authenticateToken,updateTodo);
app.delete("/todos/:id",authenticateToken,deleteTodo);
app.get("/todos/search",authenticateToken,searchTodo);
app.patch("/todos/:id/toggle",authenticateToken,toggleTodo);

app.listen(PORT,'0.0.0.0',()=>{
  console.log(`Server is listening on port:${PORT}`);
})