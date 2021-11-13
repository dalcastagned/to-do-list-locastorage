var input = document.getElementById('input');
var checkIcon = "check_circle";
var uncheckIcon = "radio_button_unchecked";
var lineThrough = "lineThrough";
var totalStatistic = document.getElementById('totalStatistic');
var remainingStatistic = document.getElementById('remainingStatistic');
var completeStatistic = document.getElementById('completeStatistic');
var total = 0;
var remaining = 0;
var complete = 0;

//function to show statistics on the screen
function statistics() {
	remaining = total - complete;
	totalStatistic.innerHTML = total;
	remainingStatistic.innerHTML = remaining;
	completeStatistic.innerHTML = complete;
}

//function that opens the confirmation popup for clear all
function popupClearAll() {
	var myPopupClearAll = document.getElementById("myPopupClearAll");
	var completeStatistic = document.getElementById("completeStatistic");
	var popupClearAll = document.getElementById("popupClearAll")

	var coordinates = completeStatistic.getBoundingClientRect();

	popupClearAll.style.top = coordinates.top
	popupClearAll.style.left = coordinates.left

	myPopupClearAll.classList.toggle("show");
}

//function to clear all localstorage
function clearAll() {
	localStorage.clear();
	location.reload();
};

let list = [],
	id = 0;

//when starting it checks if there is something in the localstorage and shows it on the screen	
var data = localStorage.getItem('toDoList');

if (data) {
	list = JSON.parse(data);
	list.forEach(function (item) {
		addToDO(item.name, item.id, item.done);
		if (item.done == "1") {
			complete++;
		}
	})
	total = list.length;
	statistics();
} else {
	list = [];
}

//check the id of the last array to start counting from it
var lastArray = list[list.length - 1]

if (lastArray == undefined) {
	id = 0
} else {
	id = lastArray.id + 1
}

//check if enter was pressed to add task
document.addEventListener('keyup', function (event) {
	if (event.code === "Enter" || event.code === "NumpadEnter" || event.keyCode == 13) {
		addList();
	}
});

//function that adds tasks to array and saves to localstorage
function addList() {
	var toDo = input.value.trim();

	if (toDo) {
		addToDO(toDo, id, false);
		list.push({
			name: toDo,
			id: id,
			done: false
		});

		localStorage.setItem('toDoList', JSON.stringify(list));

		id++;
		total++;
		statistics();
	}
	input.value = '';
}

//function that creates objects on the screen
function addToDO(toDo, id, done) {

	var DONE = done ? checkIcon : uncheckIcon;
	var LINE = done ? lineThrough : '';
	var CHECKED = done ? 'checked' : '';
	var CONTENTEDIT = done ? false : true;

	var item = `
		<li class="item">
			<i class="material-icons checkBtn ${CHECKED}" onclick="completeToDo(${id})" id="${id}">${DONE}</i>
			<div>
				<p class="text ${LINE}" onfocusout="makeChanges(${id})" id="text${id}" contenteditable="${CONTENTEDIT}" onkeypress="return characterLimit(${id})" onpaste="return false">${toDo}</p>
			</div>
			<div class="containerTrash">
			<i class="material-icons trashBtn" onclick="popup(${id})" id="trashBtn${id}">delete</i>
			</div>
			<div class="popup" id="popup${id}">
				<span class="popuptext" id="myPopup${id}">Tem certeza?
					<div>
						<button class="material-icons trashAccepted" onclick="removeToDo(${id})">done</button>
						<button class="material-icons trashCancel" onclick="popup(${id})">close</button>
					</div>
				</span>
			</div>
		</li>`;

	document.getElementById('list').insertAdjacentHTML("beforeend", item);
}

//function that opens the confirmation popup for task deletion
function popup(id) {
	var myPopup = document.getElementById("myPopup" + id);
	var trashBtn = document.getElementById("trashBtn" + id);
	var popup = document.getElementById("popup" + id)

	var coordinates = trashBtn.getBoundingClientRect();

	popup.style.top = coordinates.top
	popup.style.left = coordinates.left

	myPopup.classList.toggle("show");
}

//function to complete task
function completeToDo(id) {
	var element = document.getElementById(id)
	let currentArray = list.find(checkArray)
	var check = document.getElementById(element.id).innerHTML;
	var text = document.getElementById('text' + id)

	function checkArray(currentArray) {
		return currentArray.id === id
	}

	if (check === checkIcon) {
		document.getElementById(element.id).innerHTML = uncheckIcon;
		currentArray.done = false;
		element.parentNode.querySelector('.checkBtn').classList = "material-icons checkBtn";
		element.parentNode.querySelector('.text').classList = "text";
		text.contentEditable = true;
		complete--;
		statistics();
	} else {
		document.getElementById(element.id).innerHTML = checkIcon
		currentArray.done = true;
		element.parentNode.querySelector('.checkBtn').classList = "material-icons checkBtn checked";
		element.parentNode.querySelector('.text').classList = "text lineThrough";
		text.contentEditable = false;
		complete++;
		statistics();
	}
	localStorage.setItem('toDoList', JSON.stringify(list));
}

//function to remove task
function removeToDo(id) {
	var element = document.getElementById(id)
	let currentArray = list.find(checkArray)

	element.parentNode.parentNode.removeChild(element.parentNode);

	function checkArray(currentArray) {
		return currentArray.id === id
	}

	if (currentArray.done) {
		complete--
	}

	list.splice(list.indexOf(currentArray), 1);
	localStorage.setItem('toDoList', JSON.stringify(list));

	total--;
	statistics();
}

//function to save task change
function makeChanges(id) {
	var text = document.getElementById('text' + id)
	let currentArray = list.find(checkArray)

	function checkArray(currentArray) {
		return currentArray.id === id
	}

	currentArray.name = text.innerHTML;

	localStorage.setItem('toDoList', JSON.stringify(list));
}

//function to limit characters of task change
function characterLimit(id) {
	return (document.getElementById('text' + id).innerText.length < 99)
}