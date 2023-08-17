let topTitle = document.getElementById("top");
let myToggleButton = document.getElementById("myToggleButton");
let inputbook = document.getElementById("book");
let inputauth = document.getElementById("auth");
let submit = document.getElementById("add");
let deleteAll = document.getElementById("all");
let myDivList = document.querySelector(".books-list");
let table = document.getElementById("table");
let title = document.getElementById("title");
let writter = document.getElementById("writ");
let action = document.getElementById("action");
let form = document.querySelector(".form");
let myTbody = document.getElementById("test");
let tdTest = document.getElementsByTagName("td");
let searchblock = document.getElementById("searchblock");
let search = document.getElementById("search");
let searchbook = document.getElementById("searchbook");

//dark mode
let dark = JSON.parse(localStorage.getItem("mode"));
if (dark) {
  myToggleButton.classList.add("on");

  document.body.classList.add("dark");
  form.classList.add("dark");
  inputauth.classList.add("dark");
  inputbook.classList.add("dark");
  topTitle.classList.add("dark");
  searchblock.classList.add("dark");
  search.classList.add("dark");
}
myToggleButton.addEventListener("click", function () {
  myToggleButton.classList.toggle("on");
  document.body.classList.toggle("dark");
  form.classList.toggle("dark");
  inputauth.classList.toggle("dark");
  inputbook.classList.toggle("dark");
  topTitle.classList.toggle("dark");
  searchblock.classList.toggle("dark");
  search.classList.toggle("dark");

  addToLocalStorage();
});
function addToLocalStorage() {
  localStorage.setItem(
    "mode",
    JSON.stringify(myToggleButton.classList.contains("on"))
  );
}
//end dark mode

let arrayOfBooks = [];
if (localStorage.getItem("bookList")) {
  arrayOfBooks = JSON.parse(localStorage.getItem("bookList"));
} else {
  arrayOfBooks = [];
}
getDataFromLocalStorage();

submit.addEventListener("click", function () {
  formValidation(inputbook.value, inputauth.value);

  if (inputbook.value !== "" && inputauth.value !== "") {
    inputbook.value = "";
    inputauth.value = "";
  }
});
//validation

function formValidation(book, auth) {
  let bookValidation = /^[a-zA-Z0-9\s]+$/gi;
  let authValidation = /^[a-zA-Z\s]+$/gi;

  if (book.match(bookValidation) && auth.match(authValidation)) {
    auth.toUpperCase();

    addBookToLocalStorage(book, auth);
  } else if (!book.match(bookValidation)) {
    alert("please chek the book title");
    inputbook.value = book;
  } else if (!auth.match(authValidation)) {
    alert("please chek the author name");
  }
}

// delete all elements
deleteAll.addEventListener("click", function () {
  if (confirm("Are you sur you want to delete all the books")) {
    localStorage.removeItem("bookList");
    myTbody.innerHTML = "";
    arrayOfBooks = [];
    localStorage.setItem("bookList", JSON.stringify(arrayOfBooks));
    deleteAll.style.display = "none";
    searchblock.style.display = "none";
  }
});

//add data to localstorage
function addBookToLocalStorage(bookTitle, authorName) {
  let archive = {
    id: Date.now(),
    title: bookTitle,
    writer: authorName,
    completed: false,
  };

  arrayOfBooks.push(archive);

  showElement(arrayOfBooks);

  localStorage.setItem("bookList", JSON.stringify(arrayOfBooks));
}

// get data from local storage
function getDataFromLocalStorage() {
  let data = JSON.parse(localStorage.getItem("bookList"));
  if (data) {
    showElement(data);
  }
}
//put element in the table
function showElement(books) {
  myTbody.innerHTML = "";

  if (books.length > 0) {
    deleteAll.style.display = "block";
    searchblock.style.display = "block";
  }

  books.forEach((book) => {
    let myTr = document.createElement("tr");
    let myTitleTd = document.createElement("td");
    let myAuthTd = document.createElement("td");
    let myActionTd = document.createElement("td");
    let myDeleteBtn = document.createElement("button");
    myDeleteBtn.setAttribute("id", "del");
    myTr.setAttribute("data-id", book.id);
    myDeleteBtn.innerHTML = "Delete";
    let myCompletedBtn = document.createElement("button");
    myCompletedBtn.setAttribute("id", "comp");
    myCompletedBtn.classList.add("comp");
    myDeleteBtn.classList.add("del");

    if (book.completed) {
      myTr.classList.toggle("done");
    }
    myCompletedBtn.innerHTML = "Completed";
    myTr.append(myTitleTd);
    myTr.append(myAuthTd);
    myTr.append(myActionTd);
    myTbody.append(myTr);
    myActionTd.append(myDeleteBtn);
    myActionTd.append(myCompletedBtn);

    myTitleTd.innerHTML = book.title;
    myAuthTd.innerHTML = book.writer;
    updateBook(book);
  });
}

myTbody.addEventListener("click", (e) => {
  if (e.target.classList.contains("comp")) {
    let parent = e.target.parentElement;
    let grandParent = parent.parentElement;
    grandParent.getAttribute("data-id");
    updateBook(grandParent.getAttribute("data-id"));
    grandParent.classList.toggle("done");
  }
  if (e.target.classList.contains("del")) {
    let parent = e.target.parentElement;
    let grandParent = parent.parentElement;
    grandParent.getAttribute("data-id");
    deleteBook(grandParent.getAttribute("data-id"));
  }
});
//update book

function updateBook(bookId) {
  for (let i = 0; i < arrayOfBooks.length; i++) {
    if (arrayOfBooks[i].id == bookId) {
      arrayOfBooks[i].completed == false
        ? (arrayOfBooks[i].completed = true)
        : (arrayOfBooks[i].completed = false);
    }
  }
  localStorage.setItem("bookList", JSON.stringify(arrayOfBooks));
}

//delete book

function deleteBook(bookId) {
  arrayOfBooks = arrayOfBooks.filter((book) => book.id != bookId);
  localStorage.setItem("bookList", JSON.stringify(arrayOfBooks));
  showElement(arrayOfBooks);

  if (arrayOfBooks.length < 1) {
    deleteAll.style.display = "none";
    searchblock.style.display = "none";
  }
}
//Search book

search.onkeyup = function () {
  const searchTerm = search.value.toLowerCase();

  const matchingBooks = arrayOfBooks.filter((book) =>
    book.title.toLowerCase().includes(searchTerm)
  );

  if (matchingBooks.length > 0) {
    showElement(matchingBooks);
  } else {
    myTbody.style.cssText = "color:red;width:100%;text-align:center";
    myTbody.innerHTML = "No matching books found";
  }
};
