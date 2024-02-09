const navLogo = document.querySelector(".text-logo");
const textlogo = [...navLogo.textContent].map((t) => `<span>${t}</span>`).join("");
navLogo.innerHTML = textlogo;

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#inputBook").addEventListener("submit", (e) => {
    e.preventDefault();
    addBooksList();
  });

  if (storageExist()) {
    loadData();
  }
});

const booklist = [];
const book_event = "book_event";

// Menambahkan data buku baru
function addBooksList() {
  const nameBook = document.querySelector("#inputJudul").value;
  const authorBook = document.querySelector("#inputPenulis").value;
  const yearBook = document.querySelector("#inputTanggal").value;
  const checkComplete = document.querySelector("#inputChecbox").checked;

  function addBooks(name, author, year, isComplete) {
    this.id = +new Date();
    this.name = name;
    this.author = author;
    this.year = year;
    this.isComplete = isComplete;
  }

  const books = new addBooks(nameBook, authorBook, yearBook, checkComplete);
  booklist.push(books);

  document.dispatchEvent(new Event(book_event));
  saveData();
}

// Mengecek Storage apakah support atau tidak
function storageExist() {
  if (typeof Storage === undefined) {
    alert("Browser tidak support storage");
    return false;
  } else {
    return true;
  }
}

// Save data buku ke local storage
function saveData() {
  if (storageExist()) {
    const stringBookList = JSON.stringify(booklist);
    localStorage.setItem("book", stringBookList);
    document.dispatchEvent(new Event(book_event));
  }
}

// load data buku dari local storage
function loadData() {
  const loadBookList = localStorage.getItem("book");
  let data = JSON.parse(loadBookList);

  if (data !== null) {
    for (const e of data) {
      booklist.push(e);
    }
  }

  document.dispatchEvent(new Event(book_event));
}

// Show Books - To List
document.addEventListener(book_event, function () {
  const statusResume = document.querySelector(".resume .body");
  statusResume.innerHTML = "";

  const statusComplete = document.querySelector(".complete .body");
  statusComplete.innerHTML = "";
  for (const e of booklist) {
    const listElement = putElement(e);
    if (e.isComplete == false) {
      statusResume.append(listElement);
    } else {
      statusComplete.append(listElement);
    }
  }
});

// Show Books - Add Element
function putElement(parE) {
  const classItem = document.createElement("div");
  classItem.classList.add("body-item");
  classItem.setAttribute("id", `id-${parE.id}`);

  const Bookname = document.createElement("h4");
  Bookname.innerText = parE.name;

  const Author = document.createElement("p");
  Author.innerText = parE.author;

  const Year = document.createElement("p");
  Year.innerText = parE.year;

  classItem.append(Bookname, Author, Year);

  if (parE.isComplete == false) {
    const moveBook = document.createElement("button");
    moveBook.classList.add("move-book");
    moveBook.innerText = "Selesai";

    // Move Book Event
    moveBook.addEventListener("click", () => {
      moveBookStatus(parE.id);
    });

    const trashBook = document.createElement("button");
    trashBook.classList.add("delete-book");
    trashBook.innerText = "Hapus";

    // Delete Book Event
    trashBook.addEventListener("click", () => {
      deleteBookStatus(parE.id);
    });

    const buttonclass = document.createElement("div");
    buttonclass.classList.add("button-action");
    buttonclass.append(moveBook, trashBook);

    classItem.append(buttonclass);
  } else {
    const moveBook = document.createElement("button");
    moveBook.classList.add("move-book");
    moveBook.innerText = "Belum Selesai";

    // Move Book Event
    moveBook.addEventListener("click", () => {
      moveBookStatus(parE.id);
    });

    const trashBook = document.createElement("button");
    trashBook.classList.add("delete-book");
    trashBook.innerText = "Hapus";

    // Delete Book Event
    trashBook.addEventListener("click", () => {
      deleteBookStatus(parE.id);
    });

    const buttonclass = document.createElement("div");
    buttonclass.classList.add("button-action");
    buttonclass.append(moveBook, trashBook);

    classItem.append(buttonclass);
  }

  return classItem;
}

// Show Books - Move Book
function moveBookStatus(bookid) {
  const conf = confirm("Apakah Buku telah selesai dibaca ?");
  const idBooks = findbook(bookid);

  if (conf == true) {
    idBooks.isComplete = !idBooks.isComplete;
    document.dispatchEvent(new Event(book_event));
    saveData();
  } else if (conf == false || idBooks == null) {
    return;
  }
}

// Show Books - findID
function findbook(bookid) {
  for (const item of booklist) {
    if (item.id === bookid) {
      return item;
    }
  }
  return null;
}

// Show Books - Delete Book
function deleteBookStatus(bookid) {
  const conf = confirm("Hapus Buku ?");
  const idBooks = findbookIndex(bookid);

  if (conf == true) {
    booklist.splice(idBooks, 1);
    alert("Buku Telah Dihapus");
    document.dispatchEvent(new Event(book_event));
    saveData();
  } else if (conf == false || idBooks === -1) {
    return;
  }
}

// Show Books - findID from index
function findbookIndex(bookid) {
  for (const i in booklist) {
    if (booklist[i].id === bookid) {
      return i;
    }
  }
}

// Search
document.querySelector("#searchBook").addEventListener("submit", (e) => {
  e.preventDefault();
  searchBooks();
});
document.querySelector("#inputSearch").addEventListener("keyup", (e) => {
  e.preventDefault();
  searchBooks();
});

function searchBooks() {
  const searchValue = document.querySelector("#inputSearch").value.toLowerCase();
  const statusResume = document.querySelector(".resume .body");
  const statusComplete = document.querySelector(".complete .body");

  statusResume.innerHTML = "";
  statusComplete.innerHTML = "";

  if (searchValue == "") {
    document.dispatchEvent(new Event(book_event));
    return;
  }

  for (const e of booklist) {
    if (e.name.toLowerCase().includes(searchValue)) {
      if (e.isComplete === false) {
        let el = `
      <div class="body-item" id="id-${e.id}">
      <h4>${e.name}</h4>
      <p>${e.author}</p>
      <p>${e.year}</p>
      <div class="button-action">
          <button class="move-book" onclick="moveBookStatus(${e.id})">Selesai</button>
          <button class="delete-book" onclick="deleteBookStatus(${e.id})">Hapus</button>
      </div>
      </div>`;

        statusResume.innerHTML += el;
      } else {
        let el = `
      <div class="body-item" id="id-${e.id}">
      <h4>${e.name}</h4>
      <p>${e.author}</p>
      <p>${e.year}</p>
      <div class="button-action">
          <button class="move-book" onclick="moveBookStatus(${e.id})">Selesai</button>
          <button class="delete-book" onclick="deleteBookStatus(${e.id})">Hapus</button>
      </div>
      </div>`;

        statusComplete.innerHTML += el;
      }
    }
  }
}
