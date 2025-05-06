const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('tasks');

async function fetchTasks() {
    const res = await fetch('/api/tasks');
    const tasks = await res.json();
    list.innerHTML = tasks.map(t =>
        `<li data-id="${t._id}">
            <input type="checkbox" ${t.completed ? 'checked' : ''}>
            <span>${t.text}</span>
            <button class="del">x</button>
        </li>`
    ).join('');
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.value })
    });
    input.value = '';
    fetchTasks();
});

list.addEventListener('click', async (e) => {
    const li = e.target.closest('li');
    const id = li.dataset.id;
    if (e.target.classList.contains('del')) {
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    } else if (e.target.type === 'checkbox') {
        await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: e.target.checked })
        });
    }
    fetchTasks();
});
    
fetchTasks();