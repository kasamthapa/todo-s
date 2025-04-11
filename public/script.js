

let isSigningUp= false;
let isAddingTodo = false;

const API_URL = ''; // Replace with your IP

document.getElementById('signup-form').addEventListener('submit',async(e)=>{
  e.preventDefault();
  if(isSigningUp) return;
  isSigningUp = true;
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;

  try{
    const response = await axios.post(`${API_URL}/signup`,{username,password});
    const result = response.data;
    document.getElementById('response-message').innerText = result.msg || 'Signed Up successfullu!';
    document.getElementById('signup-container').style.display= "none";
    document.getElementById('signin-container').style.display= "block";

  }
  catch(e){
    document.getElementById('response-message').innerText = e.response?.data?.message || 'Sign Up error'
  }
  finally{
    isSigningUp= false;
  }
})

document.getElementById('signin-form').addEventListener('submit',async(e)=>{
  e.preventDefault();
  const username = document.getElementById('signin-username').value;
  const password = document.getElementById('signin-password').value;

  try{
    const response = await axios.post(`${API_URL}/login`,{username,password});
    const result = response.data;
    localStorage.setItem('token',result.token);
    document.getElementById('response-message').innerText = result.msg || 'Signed In successfullu!';
    document.getElementById('signin-container').style.display= "none";
    document.getElementById('todo-container').style.display= "block";
    loadTodos();
    document.getElementById('response-message').innerHTML =`Logged in successfully <a href='#' id='logout-link'>Logout</a>`;

    document.getElementById('logout-link').addEventListener('click',(e)=>{
      e.preventDefault();
      logOut();
    })
  }
  catch(e){
    document.getElementById('response-message').innerText = e.response?.data?.message || 'Sign In error'
  }
  
})

function logOut(){
  localStorage.removeItem('token');
  document.getElementById('todo-container').style.display='none';
  document.getElementById('response-message').innerText ='';
  document.getElementById('todo-list').innerHTML='';
  document.getElementById('signin-container').style.display="block";

}

//ADd todo 
document.getElementById('todo-form').addEventListener('submit',async(e)=>{
  e.preventDefault();
  if(isAddingTodo) return;
  isAddingTodo = true;
  const task = document.getElementById('todo-input').value.trim();
  if(!task){
    isAddingTodo= false;
    return;
  }
  const token = localStorage.getItem('token');
try{
  const response = await axios.post(`${API_URL}/todos`,{task},
    {headers:{
      'authorization':`Bearer ${token}`,
    }
  },
  );
  document.getElementById('todo-input').value='';
  loadTodos();
}
catch(e){
  document.getElementById('response-message').innerText = e.response?.data?.message || 'error adding todo'
}
finally{
  isAddingTodo=false;
}

})

async function loadTodos(){
  const token = localStorage.getItem('token');
try{
  const response = await axios.get(`${API_URL}/todos`,{
    headers:{
      'authorization':`Bearer ${token}`,
    }
  })

  const todos = response.data;
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML='';
  todos.forEach(todo=>{
    const li = document.createElement('li');
    li.setAttribute('data-id',todo.id);

    const checkbox= document.createElement('input');
    checkbox.type='checkbox';
    checkbox.checked= todo.completed;
    checkbox.addEventListener('change',()=> toggleTodo(todo.id));

    const title = document.createElement('span');
    title.textContent= todo.task;
    if(todo.completed) title.style.textDecoration='line-through';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent='Delete';
    deleteBtn.addEventListener('click',()=> deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(title);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);

  })
}
catch(e){
  document.getElementById('response-message').innerText = e.response?.data?.message || 'error loading todos'
}
}

async function toggleTodo(id) {
  const token = localStorage.getItem('token');

try{
  const response = await axios.patch(`${API_URL}/todos/${id}/toggle`,null,{
    headers:{
      'authorization':`Bearer ${token}`,
    }
  })
  const updatedTodo= response.data;
  const li = document.querySelector(`[data-id="${id}"]`);
  const title = li.querySelector('span');
  title.style.textDecoration=updatedTodo.completed ?'line-through':'none';
  const checkbox = li.querySelector('input[type="checkbox"]');
  checkbox.checked = updatedTodo.completed

}
catch(e){
  document.getElementById('response-message').innerText = e.response?.data?.message || 'error toggling todos';
}
   
}

async function deleteTodo(id) {
  const token = localStorage.getItem('token');

  try{
    await axios.delete(`${API_URL}/todos/${id}`,{
      headers:{
        'authorization':`Bearer ${token}`},
    })
    const li = document.querySelector(`[data-id="${id}"]`);
    li.remove();
  }
  catch(e){
  document.getElementById('response-message').innerText = 'Error deleting todo';
  }

}

document.getElementById('show-signin').addEventListener('click',(e)=>{
  e.preventDefault();
  document.getElementById('signup-container').style.display='none';
  document.getElementById('signin-container').style.display='block';
})
document.getElementById('show-signup').addEventListener('click',(e)=>{
  e.preventDefault();
  document.getElementById('signup-container').style.display='block';
  document.getElementById('signin-container').style.display='none';
})

document.addEventListener('DOMContentLoaded',()=>{
const token = localStorage.getItem('token');
if(token){
  document.getElementById('signup-container').style.display='none';
  document.getElementById('signin-container').style.display='none';
  document.getElementById('todo-container').style.display='block';
  loadTodos();
  document.getElementById('response-message').innerHTML =`Logged in successfully <a href='#' id='logout-link'>Logout</a>`;

  document.getElementById('logout-link').addEventListener('click',(e)=>{
    e.preventDefault();
    logOut();
  })

}
})