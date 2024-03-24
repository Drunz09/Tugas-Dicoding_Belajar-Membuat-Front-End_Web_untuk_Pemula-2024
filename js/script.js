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
    this.year = parseInt(year);
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
    // Move Book Event
    const moveBook = document.createElement("button");
    moveBook.classList.add("move-book");
    moveBook.innerHTML = `<i class='bx bx-check'></i>`;

    moveBook.addEventListener("click", () => {
      moveBookStatus(parE.id);
    });

    // Delete Book Event
    const trashBook = document.createElement("button");
    trashBook.classList.add("delete-book");
    trashBook.innerHTML = `<i class='bx bxs-trash'></i>`;

    trashBook.addEventListener("click", () => {
      deleteBookStatus(parE.id);
    });

    // Edit Book Event
    const editBook = document.createElement("button");
    editBook.classList.add("edit-book");
    editBook.innerHTML = `<i class='bx bx-edit' ></i>`;

    editBook.addEventListener("click", () => {
      editBookStatus(parE.id);
    });

    const buttonclass = document.createElement("div");
    buttonclass.classList.add("button-action");
    buttonclass.append(moveBook, trashBook, editBook);

    classItem.append(buttonclass);
  } else {
    // Move Book Event
    const moveBook = document.createElement("button");
    moveBook.classList.add("move-book");
    moveBook.innerHTML = `<i class='bx bx-x'></i>`;

    moveBook.addEventListener("click", () => {
      moveBookStatus(parE.id);
    });

    // Delete Book Event
    const trashBook = document.createElement("button");
    trashBook.classList.add("delete-book");
    trashBook.innerHTML = `<i class='bx bxs-trash'></i>`;

    trashBook.addEventListener("click", () => {
      deleteBookStatus(parE.id);
    });

    // Edit Book Event
    const editBook = document.createElement("button");
    editBook.classList.add("edit-book");
    editBook.innerHTML = `<i class='bx bx-edit' ></i>`;

    editBook.addEventListener("click", () => {
      editBookStatus(parE.id);
    });

    const buttonclass = document.createElement("div");
    buttonclass.classList.add("button-action");
    buttonclass.append(moveBook, trashBook, editBook);

    classItem.append(buttonclass);
  }

  return classItem;
}

// Show Books - Move Book
function moveBookStatus(bookid) {
  const idBooks = findbook(bookid);

  swal
    .fire({
      title: "Pindahkan!",
      text: "Apakah buku ingin dipindahkan ?",
      showDenyButton: true,
      confirmButtonText: "Iya",
      denyButtonText: `Tidak`,
    })
    .then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Saved!", "", "success");
        idBooks.isComplete = !idBooks.isComplete;
        document.dispatchEvent(new Event(book_event));
        saveData();
      } else if (result.isDenied || idBooks == null) {
        Swal.fire("Buku tidak jadi dipindahkan", "", "info");
      }
    });
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
  const idBooks = findbookIndex(bookid);
  swal
    .fire({
      title: "Hapus Buku!",
      text: "Apakah buku ingin dihapus ?",
      showDenyButton: true,
      confirmButtonText: "Iya",
      denyButtonText: `Tidak`,
    })
    .then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Saved!", "", "success");
        booklist.splice(idBooks, 1);
        document.dispatchEvent(new Event(book_event));
        saveData();
      } else if (result.isDenied || idBooks === -1) {
        Swal.fire("Buku tidak jadi dihapus", "", "info");
      }
    });
}

// Show Books - findID from index
function findbookIndex(bookid) {
  for (const i in booklist) {
    if (booklist[i].id === bookid) {
      return i;
    }
  }
}

// Show Books - edit Book
function editBookStatus(bookId) {
  const idBooks = findbook(bookId);

  const bookComplete = idBooks.isComplete == true ? "checked" : "";
  const editForm = document.querySelector(".edit");
  editForm.classList.add("active");

  editForm.innerHTML = `
  <h3>Edit Buku</h3>
          <form id="editBooks">
            <input type="text" maxlength="10" value="${idBooks.name}" id="inputEditJudul" required />
            <input type="text" maxlength="15" value="${idBooks.author}" id="inputEditPenulis" required />
            <input type="number" maxlength="15" id="inputEditTanggal" value="${idBooks.year}" required />
            <div class="check">
              <label for="inputChecbox">Selesai Dibaca ?</label>
              <input type="checkbox" id="inputEditChecbox"  ${bookComplete}  />
            </div>
            <button id="EditbookSubmit" type="submit">Edit Buku</button>
            <input type="button" onclick="closeForm()" value="Tidak Jadi" />
          </form>
          `;

  document.querySelector("#editBooks").addEventListener("submit", (e) => {
    e.preventDefault();
    const editName = document.querySelector("#inputEditJudul").value;
    const editAuthor = document.querySelector("#inputEditPenulis").value;
    const editYear = document.querySelector("#inputEditTanggal").value;
    const editChecked = document.querySelector("#inputEditChecbox").checked;

    swal
      .fire({
        title: "Edit Buku!",
        text: "Apakah buku telah selesai diedit?",
        showDenyButton: true,
        confirmButtonText: "Iya",
        denyButtonText: `Tidak`,
      })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Saved!", "", "success");
          idBooks.name = editName;
          idBooks.author = editAuthor;
          idBooks.year = parseInt(editYear);
          idBooks.isComplete = editChecked;
          editForm.classList.remove("active");
          document.dispatchEvent(new Event(book_event));
          saveData();
        } else if (result.isDenied) {
          Swal.fire("Silahkan edit terlebih dahulu", "", "info");
        }
      });
  });
}

// Show Books - edit Book_Close Form
function closeForm() {
  const editForm = document.querySelector(".edit");
  editForm.classList.remove("active");
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
          <button class="move-book" onclick="moveBookStatus(${e.id})"><i class='bx bx-check'></i></button>
          <button class="delete-book" onclick="deleteBookStatus(${e.id})"><i class='bx bxs-trash'></i></button>
          <button class="edit-book" onclick="editBookStatus(${e.id})"><i class='bx bx-edit' ></i></button>
          
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
          <button class="move-book" onclick="moveBookStatus(${e.id})"><i class='bx bx-x'></i></button>
          <button class="delete-book" onclick="deleteBookStatus(${e.id})"><i class='bx bxs-trash'></i></button>
          <button class="edit-book" onclick="editBookStatus(${e.id})"><i class='bx bx-edit' ></i></button>
      </div>
      </div>`;

        statusComplete.innerHTML += el;
      }
    }
  }
}
