const TASKS_API_URL = "http://localhost:3000/tasks";

async function fetchTasks() {
	const response = await fetch(TASKS_API_URL);
	if (!response.ok) {
		throw new Error("Failed to load tasks");
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

		checkbox.type = "checkbox";
		checkbox.checked = Boolean(task.completed);
		checkbox.disabled = true;

		title.textContent = String(task.title ?? "");

		listItem.append(checkbox, title);
		taskListElement.appendChild(listItem);
	});
}

function handleFormSubmit(event) {
	event.preventDefault();
}

async function loadTasks() {
	const statusMessageElement = document.getElementById("status-message");

	try {
		const tasks = await fetchTasks();
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
