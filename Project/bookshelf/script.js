// {
//   id: string | number,
//   title: string,
//   author: string,
//   year: number,
//   isComplete: boolean,
// }

const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_DATA';

const bookTitle = []

// Book ID generator
function getBookId() {
  return +new Date();
}

// Book Data
function generateBookData(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  }
}

// check browser storage
function checkStorage() {
  if (typeof (Storage) === undefined) {
    alert("Your browser didn't support local storage")
    return false;
  }
  return true;
}

// find book id 
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

// find book index
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

// save data to local storage
function saveData() {
  if (checkStorage()) {
    const toString = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, toString);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

// load data from local storage
function loadData() {
  const getData = localStorage.getItem(STORAGE_KEY);
  let parsedData = JSON.parse(getData);
  if (parsedData !== null) {
    for (const book of parsedData) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// make book article
function makeBookData(bookObject) {
  const { id, title, author, year, isComplete } = bookObject;

  const textTitle = document.createElement('h3');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = author;

  const textYear = document.createElement('p');
  textYear.innerText = year;

  const actionButton = document.createElement('div');
  actionButton.classList.add('action');

  const container = document.createElement('article');
  container.classList.add('book-item');
  container.append(textTitle, textAuthor, textYear, actionButton);
  container.setAttribute('id', `${id}_book`);

  if (isComplete) {
    const unreadButton = document.createElement('button');
    unreadButton.classList.add('move');
    unreadButton.textContent = 'Move to unread'
    unreadButton.addEventListener('click', function () {
      moveBookToUnread(id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.textContent = 'Delete book'
    deleteButton.addEventListener('click', function () {
      removeBook(id);
    });

    actionButton.append(unreadButton, deleteButton);
  } else {
    const readButton = document.createElement('button');
    readButton.classList.add('move');
    readButton.textContent = 'Move to read'
    readButton.addEventListener('click', function () {
      moveBookToRead(id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.textContent = 'Delete book'
    deleteButton.addEventListener('click', function () {
      removeBook(id);
    });

    actionButton.append(readButton, deleteButton);
  }

  return container;
}

// add inputed book data to books array
function addBook() {
  const textBookTitle = document.getElementById('inputBookTitle').value;
  const textBookAuthor = document.getElementById('inputBookAuthor').value;
  const textBookYear = document.getElementById('inputBookYear').value;
  const textBookIsComplete = document.getElementById('inputBookIsComplete').checked; // get boolean value
  const bookId = getBookId();

  const bookObject = generateBookData(bookId, textBookTitle, textBookAuthor, textBookYear, textBookIsComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
}

// move book to unread section
function moveBookToUnread(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// move book to read section
function moveBookToRead(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
}

// remove book
function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget == -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// event listener for search book title
document.getElementById('searchBookTitle').addEventListener("keyup", function (event) {
  const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
  const bookTitle = document.querySelectorAll('.book-item > h3');

  for (let i = 0; i < bookTitle.length; i++) {
    for (book of bookTitle) {
      if (searchBook == "") {
        bookTitle[i].parentElement.style.display = "";
        // bookTitle[i].style.borderRadius = "0px";
      } else if (bookTitle[i].innerText.toLowerCase().includes(searchBook)) {
        bookTitle[i].parentElement.style.display = "";
        // bookTitle[i].style.borderRadius = "5px";
      } else {
        bookTitle[i].parentElement.style.display = "none";
        // bookTitle[i].style.borderRadius = "0px";
      }
    }
  }
});

// event listener for submiting form and check browser storage support
document.addEventListener('DOMContentLoaded', function () {
  const inputBook = document.getElementById('inputBook');
  inputBook.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (checkStorage()) {
    loadData();
  }
});

// output to console
document.addEventListener(SAVED_EVENT, () => {
  console.log('Data saved.');
});

// event listener for read, unread, and delete book
document.addEventListener(RENDER_EVENT, function () {
  const unReadBook = document.getElementById('incompleteBookshelfList');
  const readBook = document.getElementById('completeBookshelfList');

  unReadBook.innerHTML = '';
  readBook.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBookData(bookItem);
    if (bookItem.isComplete) {
      readBook.append(bookElement);
    } else {
      unReadBook.append(bookElement);
    }
  }
});