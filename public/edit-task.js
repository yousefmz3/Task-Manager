const taskIDDOM = document.querySelector('.task-edit-id')
const taskNameDOM = document.querySelector('.task-edit-name')
const taskCompletedDOM = document.querySelector('.task-edit-completed')
const editFormDOM = document.querySelector('.single-task-form')
const editBtnDOM = document.querySelector('.task-edit-btn')
const formAlertDOM = document.querySelector('.form-alert')
const params = window.location.search
const id = new URLSearchParams(params).get('id')
let tempName

const showTask = async () => {
  try {
    const {
      data: { task },
    } = await axios.get(`/api/v1/tasks/${id}`)
    const { _id: taskID, completed, name } = task

    taskIDDOM.textContent = taskID
    taskNameDOM.value = name
    tempName = name
    taskCompletedDOM.checked = !!completed
  } catch (error) {
    console.error('Failed to load task:', error)
  }
}

showTask()

editFormDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  editBtnDOM.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Saving…'
  editBtnDOM.disabled = true

  try {
    const taskName = taskNameDOM.value.trim()
    const taskCompleted = taskCompletedDOM.checked

    const {
      data: { task },
    } = await axios.patch(`/api/v1/tasks/${id}`, {
      name: taskName,
      completed: taskCompleted,
    })

    const { _id: taskID, completed, name } = task

    taskIDDOM.textContent = taskID
    taskNameDOM.value = name
    tempName = name
    taskCompletedDOM.checked = !!completed

    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = '✓ Task updated successfully'
    formAlertDOM.className = 'form-alert text-success'
  } catch (error) {
    console.error(error)
    taskNameDOM.value = tempName
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = '✗ Error saving task. Please try again.'
    formAlertDOM.className = 'form-alert text-danger'
  }

  editBtnDOM.innerHTML = '<i class="fas fa-save"></i> Save Changes'
  editBtnDOM.disabled = false

  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.className = 'form-alert'
  }, 3000)
})
