'use strict'
const setTodoFormValue = (todo) => {
    const todoForm = document.querySelector('#todoForm');
    if (todoForm) {
        todoForm.setAttribute('data-todo-id', todo.id);

        const formControlNameList = ['title'];
        for (const controlName of formControlNameList) {
            const control = todoForm.querySelector(`[name=${controlName}]`);
            control.value = todo[controlName];
        }
        const submitButton = todoForm.querySelector('button[type=submit]');
        if (submitButton) {
            submitButton.classList.remove('btn-primary');
            submitButton.classList.add('btn-success');
            submitButton.innerText = 'Update to List';
        }
    }
}
const handleTodoEdit = (todo, todoElement) => {
    console.log('Edit ne', todo);
    setTodoFormValue(todo);
};
const handleTodoRemove = (todo, todoElement) => {
    console.log('Remove ne');
    // Confirm user to delete
    const confirmMessage = `Are u sure to delete "${todo.title}"`;
    if (window.confirm(confirmMessage)) { console.log('Delete todo', todo, todoElement); };
    // TODO: REMOVE TODO FROM TODOLIST

    // REMOVE ELEMENT
    todoElement.remove();
};

const buildTodoItem = (todo) => {
    // Find todo item template
    const todoItemTemplate = document.querySelector('#todoItemTemplate');
    if (!todoItemTemplate) return null;

    // Clone template
    const todoItemFragment = todoItemTemplate.content.cloneNode(true);
    console.log(todoItemFragment);
    // Fill data :li data-todo-id, update todo title,  add event
    const todoElement = todoItemFragment.querySelector('li');
    if (todoElement) { todoElement.setAttribute('data-todo-id', todo.id.toString()) }

    const todoTitleElement = todoItemFragment.querySelector('#todoItemTitle');
    if (todoTitleElement) {
        todoTitleElement.innerText = todo.title;
        todoTitleElement.removeAttribute('id');
    }

    console.log(todoElement);


    const todoEditElement = todoElement.querySelector('#todoItemEdit');
    if (todoEditElement) {
        todoEditElement.addEventListener('click', () => handleTodoEdit(todo, todoElement));
        todoEditElement.removeAttribute('id');
    };

    const todoRemoveElement = todoElement.querySelector('#todoItemRemove');
    if (todoRemoveElement) {
        todoRemoveElement.addEventListener(
            'click',
            () => handleTodoRemove(todo, todoElement)
        );
        todoRemoveElement.removeAttribute('id');
    };

    // Return todo element
    return todoElement;
}

const buildSearchItem = (search) => {
    // Find todo item template
    const searchItemTemplate = document.querySelector('#todoItemTemplate');
    if (!searchItemTemplate) return null;

    // Clone template
    const searchItemFragment = searchItemTemplate.content.cloneNode(true);
    console.log(searchItemFragment);
    // Fill data :li data-todo-id, update todo title,  add event
    const searchElement = searchItemFragment.querySelector('li');

    const searchTitleElement = searchItemFragment.querySelector('#todoItemTitle');
    if (searchTitleElement) {
        searchTitleElement.innerText = search.title;
        searchTitleElement.removeAttribute('id');
    }
    // Return todo element
    return searchElement;
}


const renderTodoList = (todoList) => {
    // check, must be array, find ul element
    if (!Array.isArray(todoList)) return;

    const todoListElement = document.querySelector('#todoList');
    if (!todoListElement) return;
    for (const todo of todoList) {
        // build todo item element, add to ul element
        const todoItemElement = buildTodoItem(todo);
        todoListElement.appendChild(todoItemElement);

    }
}
const renderSearchList = (filteredList) => {
    // check, must be array, find ul element
    if (!Array.isArray(filteredList)) return;

    const filteredListElement = getSearchListElement();
    while (filteredListElement.hasChildNodes()) { filteredListElement.removeChild(filteredListElement.firstChild) };
    if (!filteredListElement) return;
    for (const search of filteredList) {
        // build todo item element, add to ul element
        const searchItemElement = buildSearchItem(search);
        filteredListElement.appendChild(searchItemElement);
    }
}


// ----------------
// MAIN LOGIC
// ----------------
const todoList = [
    {
        id: 1,
        title: 'Learn JS NEW',
    },
    {
        id: 2,
        title: 'Code JS NEW',
    }
];
renderTodoList(todoList);
// add new todo

const getFormValue = () => {
    const formValue = {};
    const todoForm = document.querySelector('#todoForm');
    if (todoForm) {
        const formControlNameList = ['title'];
        for (const controlName of formControlNameList) {
            const control = todoForm.querySelector(`[name=${controlName}]`);
            formValue[controlName] = control.value;
        }
    }
    console.log(formValue);
    return formValue;
}

const getTodoListElement = () => document.querySelector('ul#todoList');
const getSearchListElement = () => document.querySelector('ul#searchList');

const randomNumber = (min, max) => {
    const randomNumber = Math.trunc(Math.random() * (max - min));
    return randomNumber + min
}
const resetTodoForm = () => {
    const todoForm = document.querySelector('#todoForm');
    todoForm.reset();
    todoForm.removeAttribute('data-todo-id');

    const submitButton = todoForm.querySelector('button[type=submit]');
    if (submitButton) {
        submitButton.classList.remove('btn-success');
        submitButton.classList.add('btn-primary');
        submitButton.innerText = 'Add to list';
    }
}
const handleTodoFormSubmit = (e) => {
    console.log('Form submit: ');
    e.preventDefault();

    const todoForm = document.querySelector('#todoForm');
    if (todoForm) {
        const mode = todoForm.hasAttribute('data-todo-id') ? 'edit' : 'add';

        const formValue = getFormValue();
        switch (mode) {
            case 'add': {
                const randomId = randomNumber(1000, 10000);
                const newTodo = {
                    id: randomId,
                    ...formValue,
                };
                todoList.push(newTodo);
                const todoItemElement = buildTodoItem(newTodo);
                const todoListElement = getTodoListElement();
                if (todoListElement && todoItemElement) {
                    todoListElement.appendChild(todoItemElement);
                }
                break;
            }
            case 'edit': {
                const todoId = todoForm.getAttribute('data-todo-id');
                const todoListElement = getTodoListElement();
                const todoItemElement = todoListElement.querySelector(`li[data-todo-id="${todoId}"]`);
                const newTodo = {
                    id: todoId,
                    ...formValue,
                };
                const newTodoItemElement = buildTodoItem(newTodo);
                todoListElement.replaceChild(newTodoItemElement, todoItemElement);
                break;
            }
            default: //do nothing here
        }
    }
    resetTodoForm();
};

const todoForm = document.querySelector('#todoForm');
if (todoForm) {
    todoForm.addEventListener('submit', handleTodoFormSubmit);
}


const getSearchFormValue = () => {
    const searchValue = {};
    const searchForm = document.querySelector('#searchForm');
    if (searchForm) {
        const formControlNameList = ['sTitle'];
        for (const controlName of formControlNameList) {
            const control = searchForm.querySelector(`[name=${controlName}]`);
            searchValue[controlName] = control.value;
        }
    } console.log(searchValue);
    return searchValue;
}
const handleSearchFormSubmit = (e) => {
    console.log('Search Submit nè');
    e.preventDefault();

    const searchForm = document.querySelector('#searchForm');


    if (searchForm) {
        const searchValue = getSearchFormValue().sTitle;

        console.log(searchValue);
        let filteredList = todoList.filter(todo => todo.title.toUpperCase().includes(searchValue.toUpperCase()));
        console.log(filteredList);
        renderSearchList(filteredList);
    }
}

const searchForm = document.querySelector('#searchForm');
if (searchForm) { searchForm.addEventListener('submit', handleSearchFormSubmit) };


