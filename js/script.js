const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const dateInput = document.getElementById('dateInput');
const todoList = document.getElementById('todoList');
const filterButtons = document.querySelectorAll('.filter-btn');
const emptyMessage = document.getElementById('emptyMessage');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

dateInput.min = new Date().toISOString().split('T')[0];

todoForm.addEventListener('submit', addTodo);

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentFilter = button.dataset.filter;
        updateFilterButtons();
        displayTodos();
    });
});

displayTodos();

function addTodo(e) {
    e.preventDefault();
    
    const todoText = todoInput.value.trim();
    const todoDate = dateInput.value;
    
    if (!todoText || !todoDate) {
        alert('Please fill in all fields');
        return;
    }
    
    const todo = {
        id: Date.now(),
        text: todoText,
        date: todoDate,
        completed: false
    };
    
    todos.push(todo);
    saveTodos();
    
    todoInput.value = '';
    dateInput.value = '';
    
    displayTodos();
}

function displayTodos() {
    todoList.innerHTML = '';
    
    let filteredTodos = todos;
    
    if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    } else if (currentFilter === 'pending') {
        filteredTodos = todos.filter(todo => !todo.completed);
    }
    
    if (filteredTodos.length === 0) {
        emptyMessage.classList.remove('hidden');
        if (currentFilter === 'completed') {
            emptyMessage.textContent = 'No completed tasks';
        } else if (currentFilter === 'pending') {
            emptyMessage.textContent = 'No pending tasks';
        } else {
            emptyMessage.textContent = 'No tasks yet';
        }
        return;
    }
    
    emptyMessage.classList.add('hidden');
    
    filteredTodos.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    filteredTodos.forEach(todo => {
        const li = createTodoElement(todo);
        todoList.appendChild(li);
    });
}

function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');
    
    const formattedDate = new Date(todo.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    li.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <div class="todo-content">
            <div class="todo-text">${escapeHtml(todo.text)}</div>
            <div class="todo-date">${formattedDate}</div>
        </div>
        <button class="delete-btn">Delete</button>
    `;
    
    const checkbox = li.querySelector('.todo-checkbox');
    const deleteBtn = li.querySelector('.delete-btn');
    
    checkbox.addEventListener('change', () => toggleTodo(todo.id));
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
    
    return li;
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        displayTodos();
    }
}

function deleteTodo(id) {
    if (confirm('Delete this task?')) {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        displayTodos();
    }
}

function updateFilterButtons() {
    filterButtons.forEach(button => {
        if (button.dataset.filter === currentFilter) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}