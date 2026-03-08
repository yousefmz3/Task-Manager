const tasksDOM = document.querySelector('.tasks')
const loadingDOM = document.querySelector('.loading-text')
const formDOM = document.querySelector('.task-form')
const taskInputDOM = document.querySelector('.task-input')
const formAlertDOM = document.querySelector('.form-alert')

// Load tasks from /api/v1/tasks
const showTasks = async () => {
  loadingDOM.style.visibility = 'visible'
  try {
    const {
      data: { tasks },
    } = await axios.get('/api/v1/tasks')

    if (tasks.length < 1) {
      tasksDOM.innerHTML = `
        <div class="empty-list">
          <i class="fas fa-inbox" style="font-size:2rem;opacity:0.3;display:block;margin-bottom:0.75rem;"></i>
          No tasks yet — add one above!
        </div>`
      loadingDOM.style.visibility = 'hidden'
      return
    }

    const allTasks = tasks
      .map((task, index) => {
        const { completed, _id: taskID, name } = task
        return `
<div class="single-task ${completed ? 'task-completed' : ''}" style="animation-delay:${index * 0.06}s">
  <div class="task-left">
    <label class="task-checkbox" title="Toggle complete">
      <input
        type="checkbox"
        class="toggle-complete-cb"
        data-id="${taskID}"
        data-name="${name.replace(/"/g, '&quot;')}"
        ${completed ? 'checked' : ''}
      />
      <span class="checkbox-visual"></span>
    </label>
    <h5 class="task-name">${name}</h5>
  </div>
  <div class="task-links">
    <a href="task.html?id=${taskID}" class="edit-link" title="Edit task">
      <i class="fas fa-pen"></i>
    </a>
    <button type="button" class="delete-btn" data-id="${taskID}" title="Delete task">
      <i class="fas fa-trash"></i>
    </button>
  </div>
</div>`
      })
      .join('')

    tasksDOM.innerHTML = allTasks
  } catch (error) {
    tasksDOM.innerHTML = `
      <div class="empty-list">
        <i class="fas fa-exclamation-triangle" style="font-size:2rem;opacity:0.4;display:block;margin-bottom:0.75rem;color:#f43f5e;"></i>
        Could not load tasks. Please try again later.
      </div>`
  }
  loadingDOM.style.visibility = 'hidden'
}

showTasks()

// Handle task actions (delete + toggle complete)
tasksDOM.addEventListener('click', async (e) => {
  const el = e.target

  // --- DELETE ---
  const deleteBtn = el.closest('.delete-btn')
  if (deleteBtn) {
    loadingDOM.style.visibility = 'visible'
    const id = deleteBtn.dataset.id
    try {
      await axios.delete(`/api/v1/tasks/${id}`)
      showTasks()
    } catch (error) {
      console.error('Delete error:', error)
    }
    loadingDOM.style.visibility = 'hidden'
    return
  }

  // --- TOGGLE COMPLETE ---
  const cb = el.closest('.toggle-complete-cb')
  if (cb) {
    const id = cb.dataset.id
    const name = cb.dataset.name
    const completed = cb.checked
    const card = cb.closest('.single-task')
    // Optimistic UI update
    card.classList.toggle('task-completed', completed)
    try {
      await axios.patch(`/api/v1/tasks/${id}`, { name, completed })
    } catch (error) {
      console.error('Toggle error:', error)
      // Revert on failure
      card.classList.toggle('task-completed', !completed)
      cb.checked = !completed
    }
  }
})

// Form submit — add new task
formDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const name = taskInputDOM.value.trim()

  if (!name) {
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = 'Please enter a task name'
    formAlertDOM.className = 'form-alert text-danger'
    setTimeout(() => {
      formAlertDOM.style.display = 'none'
      formAlertDOM.className = 'form-alert'
    }, 3000)
    return
  }

  try {
    await axios.post('/api/v1/tasks', { name })
    showTasks()
    taskInputDOM.value = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = '✓ Task added successfully'
    formAlertDOM.className = 'form-alert text-success'
  } catch (error) {
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = '✗ Error adding task. Please try again.'
    formAlertDOM.className = 'form-alert text-danger'
  }

  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.className = 'form-alert'
  }, 3000)
})
