// Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-btn");
const todoList = document.querySelector(".todo-list");
const formContainer = document.querySelector("form");
const filterOption = document.querySelector(".filter-todo");
let todoContainer, editElement, cancelButton;

// Event Listener

todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", buttonActions);
filterOption.addEventListener("click", filterTodo);
window.onload = function () {
  getTodosFromLocalStorage();
};

// Functions

function addTodo(e) {
  // prevent page reloading as the type of button is submit
  e.preventDefault();
  // creating the todo container

  // creating an element using createElement
  if (todoInput.value !== "") {
    todoContainer = document.createElement("div");
    // adding a classname to div using classList.add
    todoContainer.classList.add("todo-container");

    //   creating a li
    const newTodo = document.createElement("li");
    newTodo.classList.add("todo-item");
    newTodo.innerText = todoInput.value;
    newTodo.id = parseJson()
      ? parseJson().length && +parseJson()[parseJson().length - 1].id + 1
      : 1;
    // Save to LocalStorage before clearing the value
    saveLocalStorage(todoInput.value, newTodo.id);

    todoInput.value = "";

    //  adding the li list to the container
    todoContainer.appendChild(newTodo);

    //   checkmark button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("check-btn");
    todoContainer.appendChild(completedButton);

    //   delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.classList.add("trash-btn");
    todoContainer.appendChild(deleteButton);

    //   append the whole todoContainer to the <uL> in html
    todoList.appendChild(todoContainer);
  } else {
    window.alert("Should not be empty");
  }
}

function buttonActions(e) {
  const element = e.target;

  // Delete
  if (element.classList.value.includes("trash")) {
    let todo;
    if (element.classList.value.includes("fas")) {
      const btnParent = element.parentElement;
      todo = btnParent.parentElement;
      todo.classList.add("fade-down");
      todo.addEventListener("transitionend", function () {
        todo.remove();
      });
    } else {
      todo = element.parentElement;
      todo.classList.add("fade-down");
      todo.addEventListener("transitionend", function () {
        todo.remove();
      });
    }
    if (editElement && editElement.id === todo.childNodes[0].id) {
      revertToAddState();
    }
    deleteTodoFromLocalStorage(todo.childNodes[0].id);
  }

  // Complete
  if (element.classList.value.includes("check")) {
    if (element.classList.value.includes("fas")) {
      const btnParent = element.parentElement;
      const todo = btnParent.parentElement;
      todo.classList.toggle("completed");
      updateLocalStorage(todo.childNodes[0].id);
    } else {
      const todo = element.parentElement;
      todo.classList.toggle("completed");
      updateLocalStorage(todo.childNodes[0].id);
    }
  }

  // Edit
  if (element.classList.value.includes("todo-item")) {
    editElement = element;
    todoInput.value = element.innerText;
    todoButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
    if (!cancelButton) {
      cancelButton = document.createElement("button");
      cancelButton.innerHTML = '<i class="fas fa-window-close"></i>';
      cancelButton.classList.add("todo-btn");
      formContainer.insertBefore(cancelButton, formContainer.children[2]);
    }
    cancelButton.addEventListener("click", function cancelEdit() {
      revertToAddState();
    });

    todoButton.removeEventListener("click", addTodo);
    todoButton.addEventListener("click", editTodo);
  }
}

function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.value.includes("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "pending":
        if (todo.classList.value.includes("completed")) {
          todo.style.display = "none";
        } else {
          todo.style.display = "flex";
        }
        break;
      default:
        todo.style.display = "flex";
    }
  });
}

function editTodo(e) {
  e.preventDefault();
  editId = editElement.id;
  const todos = parseJson();
  const isFoundTodo = todos.find((item) => item.id === editId);
  isFoundTodo.todo = todoInput.value;
  stringifyJson(todos);
  editElement.innerText = todoInput.value;
  revertToAddState();
}

function revertToAddState() {
  if (cancelButton) {
    cancelButton.remove();
  }
  cancelButton = undefined;
  todoButton.innerHTML = '<i class="fas fa-plus-square"></i>';
  todoButton.removeEventListener("click", editTodo);
  todoButton.addEventListener("click", addTodo);
  todoInput.value = "";
}

// LOCAL STORAGE METHODS

function saveLocalStorage(todo, id) {
  let todos;
  if (localStorage.getItem("todos")) {
    todos = parseJson();
  } else {
    todos = [];
  }
  todos.push({ id, todo, completed: false });
  stringifyJson(todos);
}

function getTodosFromLocalStorage() {
  let todos;
  if (localStorage.getItem("todos")) {
    todos = parseJson();
  } else {
    todos = [];
  }
  todos.forEach(function (todo) {
    todoContainer = document.createElement("div");
    // adding a classname to div using classList.add
    todoContainer.classList.add("todo-container");

    //   creating a li
    const newTodo = document.createElement("li");
    newTodo.classList.add("todo-item");
    newTodo.innerText = todo.todo;
    newTodo.id = todo.id;

    //  adding the li list to the container
    todoContainer.appendChild(newTodo);

    //   checkmark button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("check-btn");
    todoContainer.appendChild(completedButton);

    //   delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.classList.add("trash-btn");
    todoContainer.appendChild(deleteButton);

    if (todo.completed) {
      todoContainer.classList.add("completed");
    }

    //   append the whole todoContainer to the <uL> in html
    todoList.appendChild(todoContainer);
  });
}

function deleteTodoFromLocalStorage(id) {
  let todos;
  if (localStorage.getItem("todos")) {
    todos = parseJson();
  }
  todos = todos.filter((item) => item.id !== id);
  stringifyJson(todos);
}

function updateLocalStorage(id) {
  let todos;
  if (localStorage.getItem("todos")) {
    todos = parseJson();
  }
  const isFound = todos.find((todo) => todo.id === id);
  if (isFound) {
    isFound.completed = !isFound.completed;
  }
  stringifyJson(todos);
}

function parseJson() {
  return JSON.parse(localStorage.getItem("todos"));
}

function stringifyJson(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}
