// ==========================================
// TRADEXPRESS PRODUCTIVITY SUITE
// Customs Deadline Calendar & Operations To-Do List
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initCustomsCalendar();
    initOperationsTodoList();
});

/**
 * 1. CUSTOMS DEADLINE CALENDAR
 * Automatically builds a calendar for the current month and highlights today's date.
 */
function initCustomsCalendar() {
    const monthYearEl = document.getElementById('calendar-month-year');
    const calendarGrid = document.getElementById('calendar-grid');
    if (!monthYearEl || !calendarGrid) return; // Guard clause if elements aren't on the current view

    const today = new Date();
    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    
    // Set current Month and Year header
    monthYearEl.innerText = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Build days of the week headers
    calendarGrid.innerHTML = daysOfWeek.map(d => `
        <div style="font-weight: 600; color: #64748b; padding-bottom: 5px;">${d}</div>
    `).join('');
    
    const firstDayIndex = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    
    // Insert blank spacing for days before the 1st of the month
    for (let i = 0; i < firstDayIndex; i++) {
        calendarGrid.innerHTML += `<div></div>`;
    }
    
    // Inject each calendar day
    for (let day = 1; day <= lastDay; day++) {
        const isToday = day === today.getDate();
        const dayStyle = isToday 
            ? `background: #38bdf8; color: #0f172a; font-weight: bold; border-radius: 6px; box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);` 
            : `background: #1e293b; border-radius: 6px; transition: background 0.2s; cursor: pointer;`;
            
        calendarGrid.innerHTML += `
            <div class="calendar-day-cell" style="padding: 8px 0; ${dayStyle}" data-day="${day}">
                ${day}
            </div>
        `;
    }
}

/**
 * 2. OPERATIONS TO-DO LIST (Local Storage Persistent)
 * Allows Kenny (or visitor) to manage crucial customs and container tasks.
 */
function initOperationsTodoList() {
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');
    if (!todoInput || !addTodoBtn || !todoList) return; // Guard clause if elements don't exist

    // Fetch previously saved tasks or fallback to defaults
    let savedTasks = JSON.parse(localStorage.getItem('tx_tasks')) || [
        { text: "Coordinate container tracking with Broker Ferddy Sardan", completed: false },
        { text: "Verify updated HS codes inside articles.json", completed: true }
    ];

    // Core render function
    function renderTasks() {
        todoList.innerHTML = '';
        savedTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.style = "display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #1e293b; border-radius: 6px; margin-bottom: 8px; font-size: 0.85rem; transition: opacity 0.2s;";
            if (task.completed) li.style.opacity = "0.5";

            li.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; flex: 1; cursor: pointer;" class="task-toggle-area" data-index="${index}">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} style="cursor: pointer; pointer-events: none;">
                    <span style="${task.completed ? 'text-decoration: line-through; color: #64748b;' : 'color: #f8fafc;'}">${task.text}</span>
                </div>
                <button class="task-delete-btn" data-index="${index}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; padding: 0 4px; transition: transform 0.1s;">&times;</button>
            `;
            todoList.appendChild(li);
        });

        // Sync with browser storage
        localStorage.setItem('tx_tasks', JSON.stringify(savedTasks));
    }

    // Task completion toggle click delegation
    todoList.addEventListener('click', (e) => {
        const toggleArea = e.target.closest('.task-toggle-area');
        const deleteBtn = e.target.closest('.task-delete-btn');

        if (toggleArea) {
            const idx = parseInt(toggleArea.getAttribute('data-index'));
            savedTasks[idx].completed = !savedTasks[idx].completed;
            renderTasks();
        } else if (deleteBtn) {
            const idx = parseInt(deleteBtn.getAttribute('data-index'));
            savedTasks.splice(idx, 1);
            renderTasks();
        }
    });

    // Event listener to add new tasks
    const addTask = () => {
        const text = todoInput.value.trim();
        if (text) {
            savedTasks.push({ text, completed: false });
            todoInput.value = '';
            renderTasks();
        }
    };

    addTodoBtn.addEventListener('click', addTask);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Initial load
    renderTasks();
}