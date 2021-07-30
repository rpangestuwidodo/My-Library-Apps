const STORAGE_KEY = "BookSelf_Apps";

let books = [];

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser yang kamu gunakan tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
  document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) books = data;

  document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
  if (isStorageExist()) saveData();
}

function composeBook_Object(title, author, year, isComplete) {
  return {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };
}

function findBook(bookId) {
  for (book of books) {
    if (book.id === bookId) return book;
  }
  return null;
}

function findBookIndex(bookId) {
  let index = 0;
  for (book of books) {
    if (book.id === bookId) return index;

    index++;
  }

  return -1;
}

function refreshDataFromBooks() {
  const incompleteBookshelfList = document.getElementById(NotFinished_ReadBook_ID);
  const completeBookshelfList = document.getElementById(Finished_ReadBook_ID);

  for (book of books) {
      const newBook = makeNotFinished(book.title, `Penulis: ${book.author}`, `Tahun: ${book.year}`, book.isComplete);
      newBook[Book_ITEM_ID] = book.id;

      if (book.isComplete) {
          completeBookshelfList.append(newBook);
      } else {
          incompleteBookshelfList.append(newBook);
      }
  }
}
