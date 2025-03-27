import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const taskArray = JSON.parse(localStorage.getItem("todo")) || [];

renderTodos();

// ekle butonuna tıklandığında;
addButton.addEventListener("click", () => {
    const taskValue = taskInput.value.trim();

    if (taskValue) {
        taskArray.push({ task: taskValue });
        updateLocalStorage();
        renderTodos();
        updateTaskCount();
        taskInput.value = "";
    } else {
        iziToast.warning({
            title: 'Caution',
            message: 'Please enter a task!',
            position: 'topRight',
        });
    }
});

// task'ları html'e işleyen fonksiyon
function renderTodos() {
    taskList.innerHTML = taskArray.map((tasks) => `
        <li class="list-item">
          <input type="checkbox" class="task-checkbox" onclick="toggleTask(event)" ${tasks.completed ? 'checked' : ''}>
          <span class="task">${tasks.task}</span>
          <a href="#" class="delete-icon" onclick="deleteTask(event)">
            <i class="fa-solid fa-trash" style="color: #d01b36"></i>
          </a>
        </li>
        `).join("");
    updateTaskCount();
}

// delete ikonuna tıklandığında task'ı silen fonksiyon
window.deleteTask = function (event) {
    event.preventDefault();
    const taskElement = event.target.closest('.list-item'); // delete ikonuna en yakın li elemanını bul  
    if (taskElement) {
        const taskText = taskElement.querySelector(".task").innerText; // task metnini al

        const index = taskArray.findIndex(todo => todo.task === taskText) // task metninin indexini bul

        // görev dizide varsa sil
        if (index !== -1) {
            taskArray.splice(index, 1); // dizi içerisinden o indeksteki öğeyi sil
            updateLocalStorage(); // güncel görev dizisini yerel depolamaya kaydet 
            renderTodos();
        }
        taskElement.remove(); // li elemanını sil  
    }
}

// localStorage'ı güncelleyen fonksiyon
function updateLocalStorage() {
    localStorage.setItem("todo", JSON.stringify(taskArray));
}

function updateTaskCount() {
    const totalTasks = taskArray.length;
    const uncompletedTasks = taskArray.filter(task => !task.completed).length;
    document.getElementById("total-task").innerText = totalTasks;
    document.getElementById("uncompleted-task").innerText = uncompletedTasks;
}

// görev durumunu değiştiren fonksiyon
window.toggleTask = function (event) {
    const taskElement = event.target.closest(".list-item");
    const taskText = taskElement.querySelector(".task").innerText;

    const index = taskArray.findIndex(todo => todo.task === taskText);

    if (index !== -1) {
        taskArray[index].completed = !taskArray[index].completed;
        updateLocalStorage();
        updateTaskCount();

        // 'completed' sınıfını eklemek veya kaldırmak için
        taskElement.querySelector(".task").classList.toggle('completed', taskArray[index].completed);
    }
}