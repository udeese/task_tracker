// public/app.js

document.addEventListener('DOMContentLoaded', () => {
    const form  = document.getElementById('task-form');
    const input = document.getElementById('task-input');
    const list  = document.getElementById('tasks');

// Helper to get the Authorization header
    function authHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

// Fetch & render all tasks
    async function fetchTasks() {
    try {
        const res = await fetch('/api/tasks', {
        headers: { ...authHeader() }
        });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const tasks = await res.json();
        list.innerHTML = tasks.map(t => `
        <li data-id="${t._id}">
            <input type="checkbox" ${t.completed ? 'checked' : ''}/>
            <span>${t.text}</span>
            <button class="del">×</button>
        </li>
        `).join('');
    } catch (err) {
        console.error(err);
        // optionally show an error message in the UI
    }
    }

    // Add a new task
    form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!input.value.trim()) return;
    try {
        const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify({ text: input.value })
        });
        if (!res.ok) throw new Error(`Add failed: ${res.status}`);
        input.value = '';
        await fetchTasks();
    } catch (err) {
        console.error(err);
    }
    });

    // Handle checkbox toggle & delete
    list.addEventListener('click', async e => {
    const li = e.target.closest('li');
    if (!li) return;
    const id = li.dataset.id;

    try {
        if (e.target.classList.contains('del')) {
        const res = await fetch(`/api/tasks/${id}`, {
            method: 'DELETE',
            headers: authHeader()
        });
        if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
        } else if (e.target.type === 'checkbox') {
        const res = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            ...authHeader()
            },
            body: JSON.stringify({ completed: e.target.checked })
        });
        if (!res.ok) throw new Error(`Update failed: ${res.status}`);
        }
        await fetchTasks();
    } catch (err) {
        console.error(err);
    }
    });

    // Initial load
    fetchTasks();
});
