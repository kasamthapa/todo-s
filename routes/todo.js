let todos = [];
let currentId=1;
 
export async function getAllTodo(req,res){
  const userTodos = todos.filter(todo=> todo.userId == req.user.id);
  res.json(userTodos);
} 
  
export async function createTodo(req,res) {
  const {task} = req.body;
  if(!task) return res.status(401).json({msg:"Task needs to be added"});
  const newTodo ={
    id:currentId++,
    task,
    userId:req.user.id,
    completed:false,
  }
  todos.push(newTodo);
  res.status(201).json(newTodo);
  
}

export async function updateTodo(req,res){
  const {id} = req.params;
  const {task} = req.body;
  if(!task) return res.status(401).json({msg:"Task needs to be added"});
  const todoIndex = todos.findIndex(todo=> todo.id == id && todo.userId == req.user.id);

  if(todoIndex !== -1){
    todos[todoIndex] = { ...todos[todoIndex],task};
    return res.status(200).json(todos[todoIndex]);

  }
  else{
    return res.status(404).json({msg:"todo not found or unauthorized"});
  }
}

export async function deleteTodo(req,res){
  const {id} = req.params;
  const todoIndex = todos.findIndex(todo=> todo.id == id && todo.userId == req.user.id);

  if(todoIndex !== -1){
    todos.splice(todoIndex,1);
    return res.status(200).json(todos[todoIndex])
  }
  else{
    return res.status(401).json({msg:"todo not found or not authorized."});
  }
}

export async function searchTodo(req,res){
  const {q} = req.query;
  if(!q) return res.status(400).json({msg:"query is not provided.."});
  const userTodos = todos.filter(todo => todo.userId == req.user.id);
  const filterdTodos = userTodos.filter(todo => typeof todo.task === 'string' && todo.task.toLowerCase().includes(q.toLowerCase()));
  res.status(200).json(filterdTodos);
}

export async function toggleTodo(req,res){
  const id = Number(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id == id && todo.userId == req.user.id);

  if(todoIndex !== -1){
    todos[todoIndex] = {...todos[todoIndex],completed: !todos[todoIndex].completed}
    return res.status(200).json(todos[todoIndex]);
  }
  else{
    return res.status(401).json({msg:"todo not found or not authorized."});
  }
  
}