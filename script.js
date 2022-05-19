const addBtnAll = document.querySelectorAll(".add-btn:not(.save-btn)");
const saveBtnAll = document.querySelectorAll(".save-btn");
const addItemContainerAll = document.querySelectorAll(".add-container");
const addItemAll = document.querySelectorAll(".add-item");

const cardsEl = document.querySelectorAll(".card");
const itemListsEl = document.querySelectorAll(".drag-list");
const backlogListEl = document.getElementById("backlog");
const progressListEl = document.getElementById("in-progress");
const completeListEl = document.getElementById("complete");
const onHoldListEl = document.getElementById("on-hold");

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeModalBtn = document.querySelector(".close");
const deleteBtn = document.querySelector(".delete");
const cancelBtn = document.querySelector(".cancel");
const closeEventArr = document.querySelectorAll(".close-event");
const deleteText = document.querySelector(".delete-item-text");

let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

let updatedOnLoad = false;
let draggedItem;
let currentColumn;

const addToColumn = function (column) {
  if (!addItemAll[column].textContent) return;
  const itemText = addItemAll[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  updateDom();
  addItemAll[column].textContent = ``;
};

const showInputBox = function (column) {
  addBtnAll[column].style.visibility = "hidden";
  saveBtnAll[column].classList.remove("hidden");
  addItemContainerAll[column].classList.remove("hidden");
  addItemAll[column].focus();
};

const hideInputBox = function (column) {
  addBtnAll[column].style.visibility = "visible";
  saveBtnAll[column].classList.add("hidden");
  addItemContainerAll[column].classList.add("hidden");
  addToColumn(column);
};

const getSavedData = function () {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on project", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
};

const updateSavedData = function () {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  listArrays.forEach((e, i) => {
    localStorage.setItem(`${arrayNames[i]}Items`, JSON.stringify(e));
  });
};

const createItemEl = function (columnEl, column, item, index) {
  const listEl = document.createElement("li");
  listEl.classList.add("item-container");
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  const textEl = document.createElement("h3");
  textEl.classList.add("item");
  textEl.textContent = item;
  textEl.setAttribute("data-column", column);
  listEl.appendChild(textEl);
  columnEl.appendChild(listEl);
};

const updateDom = function () {
  if (!updatedOnLoad) getSavedData();
  //Create elements in DOM
  backlogListEl.textContent = "";
  backlogListArray.forEach((element, index) => {
    createItemEl(backlogListEl, 0, element, index);
  });
  progressListEl.textContent = "";
  progressListArray.forEach((element, index) => {
    createItemEl(progressListEl, 1, element, index);
  });
  completeListEl.textContent = "";
  completeListArray.forEach((element, index) => {
    createItemEl(completeListEl, 2, element, index);
  });
  onHoldListEl.textContent = "";
  onHoldListArray.forEach((element, index) => {
    createItemEl(onHoldListEl, 3, element, index);
  });
  updatedOnLoad = true;
  updateSavedData();
};

const rebuildArrays = function () {
  backlogListArray = [];
  progressListArray = [];
  completeListArray = [];
  onHoldListArray = [];

  for (let i = 0; i < backlogListEl.children.length; i++) {
    backlogListArray.push(backlogListEl.children[i].textContent);
  }

  for (let i = 0; i < progressListEl.children.length; i++) {
    progressListArray.push(progressListEl.children[i].textContent);
  }

  for (let i = 0; i < completeListEl.children.length; i++) {
    completeListArray.push(completeListEl.children[i].textContent);
  }

  for (let i = 0; i < onHoldListEl.children.length; i++) {
    onHoldListArray.push(onHoldListEl.children[i].textContent);
  }
  updateDom();
};

const drag = function (e) {
  draggedItem = e.target;
};

const allowDrop = function (e) {
  e.preventDefault();
};

const drop = function (e) {
  e.preventDefault();
  cardsEl.forEach((e) => e.classList.remove("over"));
  const parent = itemListsEl[currentColumn];
  parent.appendChild(draggedItem);
  rebuildArrays();
};

const dragEnter = function (column) {
  cardsEl[column].classList.toggle("over");
  currentColumn = column;
};

const dragLeave = function (column) {
  cardsEl[column].classList.toggle("over");
};

let clicked;

const deleteItem = function (e) {
  clicked = e.target.closest(".item");
  if (!clicked) return;
  clicked.textContent.length > 20
    ? (deleteText.textContent = `"${clicked.textContent.slice(0, 20)}..."`)
    : (deleteText.textContent = `"${clicked.textContent}"`);
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  deleteBtn.addEventListener("click", function () {
    if (clicked === "") return;
    const columnNumber = +clicked.dataset.column;
    let index = listArrays[columnNumber].indexOf(clicked.textContent);
    if (index > -1 && listArrays[columnNumber].includes(clicked.textContent)) {
      listArrays[columnNumber].splice(index, 1);
    }
    closeModal();
    updateDom();
  });
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  clicked = "";
};

document
  .querySelectorAll(".list")
  .forEach((e) => e.addEventListener("click", deleteItem));

closeEventArr.forEach((e) => e.addEventListener("click", closeModal));
updateDom();

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});
