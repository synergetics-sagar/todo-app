const TASKS_API_URL = "http://localhost:3000/tasks";
let tasks = [];
const taskFeedbackById = new Map();

async function fetchTasks() {
	const response = await fetch(TASKS_API_URL);
	if (!response.ok) {
		throw new Error("Failed to load tasks");
	}
	return response.json();
}

async function createTask(title) {
	const response = await fetch(TASKS_API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			title,
			completed: false
		})
	});

	if (!response.ok) {
		throw new Error("Failed to create task");
	}

	return response.json();
}

async function updateTaskCompletion(taskId, completed) {
	const response = await fetch(`${TASKS_API_URL}/${taskId}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			completed
		})
	});

	if (!response.ok) {
		const error = new Error("Failed to update task");
		error.status = response.status;
		throw error;
	}

	return response.json();
}

function renderTasks(tasks) {
	const taskListElement = document.getElementById("task-list");
	const statusMessageElement = document.getElementById("status-message");

	if (!taskListElement || !statusMessageElement) {
		return;
	}

	taskListElement.textContent = "";

	if (!Array.isArray(tasks) || tasks.length === 0) {
		statusMessageElement.textContent = "No tasks yet - add one below.";
		return;
	}

	statusMessageElement.textContent = "";

	tasks.forEach((task) => {
		const listItem = document.createElement("li");
		const checkbox = document.createElement("input");
		const title = document.createElement("span");
		const taskMessage = document.createElement("span");
		const taskCompleted = Boolean(task.completed);

		checkbox.type = "checkbox";
		checkbox.checked = taskCompleted;
		checkbox.disabled = false;
		checkbox.addEventListener("change", async () => {
			const previousCompleted = Boolean(task.completed);
			const nextCompleted = !previousCompleted;

			task.completed = nextCompleted;
			taskFeedbackById.delete(task.id);
			renderTasks(tasks);

			try {
				await updateTaskCompletion(task.id, nextCompleted);
			} catch (error) {
				if (error && error.status === 404) {
					taskFeedbackById.delete(task.id);
					tasks = tasks.filter((currentTask) => currentTask.id !== task.id);
					renderTasks(tasks);
					const refreshedStatusMessage = document.getElementById("status-message");
					if (refreshedStatusMessage) {
						refreshedStatusMessage.textContent = "Couldn't update task — it no longer exists.";
					}
					return;
				}

				task.completed = previousCompleted;
				taskFeedbackById.set(task.id, "Couldn't update task — try again.");
				renderTasks(tasks);
			}
		});

		title.textContent = String(task.title ?? "");
		title.style.textDecoration = taskCompleted ? "line-through" : "none";

		taskMessage.textContent = taskFeedbackById.get(task.id) || "";
		taskMessage.className = "task-message";

		listItem.append(checkbox, title, taskMessage);
		taskListElement.appendChild(listItem);
	});
}

function handleFormSubmit(event) {
	event.preventDefault();

	const titleInputElement = document.getElementById("task-title");
	const formMessageElement = document.getElementById("form-message");

	if (!(titleInputElement instanceof HTMLInputElement) || !formMessageElement) {
		return;
	}

	const trimmedTitle = titleInputElement.value.trim();
	if (!trimmedTitle) {
		formMessageElement.textContent = "Please enter a task title.";
		return;
	}

	formMessageElement.textContent = "";

	createTask(trimmedTitle)
		.then((createdTask) => {
			tasks.push(createdTask);
			renderTasks(tasks);
			titleInputElement.value = "";
		})
		.catch(() => {
			formMessageElement.textContent = "Couldn't add task - try again.";
		});
}

async function loadTasks() {
	const statusMessageElement = document.getElementById("status-message");

	try {
		tasks = await fetchTasks();
		renderTasks(tasks);
	} catch {
		if (statusMessageElement) {
			statusMessageElement.textContent = "Couldn't load tasks - is the server running?";
		}
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const formElement = document.getElementById("task-form");
	if (formElement) {
		formElement.addEventListener("submit", handleFormSubmit);
	}

	loadTasks();
});
