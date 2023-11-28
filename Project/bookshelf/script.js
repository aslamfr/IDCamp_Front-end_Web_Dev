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

  const textTitle = document.createElement('h2');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = author;

  const textYear = document.createElement('p');
  textYear.innerText = year;

  const actionButton = document.createElement('div');
  actionButton.classList.add('action');

  const container = document.createElement('article');
  container.classList.add('book_item');
  container.append(textTitle, textAuthor, textYear, actionButton);
  container.setAttribute('id', `${id}_book`);

  if (isComplete) {
    const unreadButton = document.createElement('button');
    unreadButton.classList.add('green');
    unreadButton.textContent = 'Belum selesai dibaca'
    unreadButton.addEventListener('click', function () {
      moveBookToUnread(id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.textContent = 'Hapus buku'
    deleteButton.addEventListener('click', function () {
      removeBook(id);
    });

    actionButton.append(unreadButton, deleteButton);
  } else {
    const readButton = document.createElement('button');
    readButton.classList.add('green');
    readButton.textContent = 'Selesai dibaca'
    readButton.addEventListener('click', function () {
      moveBookToRead(id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.textContent = 'Hapus buku'
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
  const textBookIsComplete = document.getElementById('inputBookIsComplete').checked;
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

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data saved.');
});

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