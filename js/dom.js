const NotFinished_ReadBook_ID = "notFinished-read";
const Finished_ReadBook_ID = "finished-read";
const Book_ITEM_ID = "itemId";

function makeNotFinished(title, author, year, isComplete) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = title;

  const textBookAuthor = document.createElement("p");
  textBookAuthor.innerText = author;

  const textBookYear = document.createElement("p");
  textBookYear.classList.add("yearBook");
  textBookYear.innerText = year;

  const editButton = document.createElement("button");
  editButton.classList.add("edit-btn");
  editButton.addEventListener("click", function () {
    textTitle.contentEditable = true;
    textBookAuthor.contentEditable = true;
    textBookYear.contentEditable = true;
    doneButton.style.display = "inline";
    editButton.style.display = "none";
  });

  const doneButton = document.createElement("button");
  doneButton.classList.add("done-btn");
  doneButton.addEventListener("click", function () {
    textTitle.contentEditable = false;
    textBookAuthor.contentEditable = false;
    textBookYear.contentEditable = false;
    editButton.style.display = "inline";
    doneButton.style.display = "none";
  });

  const containerEdit = document.createElement("div");
  containerEdit.classList.add("edit-container");

  const containerFinish = document.createElement("div");
  containerFinish.classList.add("finish-container");

  const cardButton = document.createElement("div");
  cardButton.classList.add("action");
  cardButton.append(containerEdit, containerFinish);

  if (isComplete) {
    containerEdit.append(editButton, doneButton);
    containerFinish.append(createUndoButton(), createTrashButton());
  } else {
    containerEdit.append(editButton, doneButton);
    containerFinish.append(createFinishedButton(), createTrashButton());
  }

  const textContainer = document.createElement("article");
  textContainer.classList.add("book_item");
  textContainer.append(textTitle, textBookAuthor, textBookYear, cardButton);

  const bookContainer = document.createElement("div");
  bookContainer.classList.add("book_list");
  bookContainer.append(textContainer);

  const bodyContainer = document.createElement("div");
  bodyContainer.classList.add("card-bodyBook-item");
  bodyContainer.append(bookContainer);

  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-item");
  cardContainer.append(bodyContainer);

  return cardContainer;
}

function createUndoButton() {
  return createChecklistButton("undo-button", function (event) {
    undoTaskFromCompleted(
      event.target.parentElement.parentElement.parentElement.parentElement
        .parentElement
    );
  });
}

function createTrashButton() {
  return createChecklistButton("trash-button", function (event) {
    removeBookFromCompleted(
      event.target.parentElement.parentElement.parentElement.parentElement
        .parentElement
    );
  });
}

function createFinishedButton() {
  return createChecklistButton("finished-button", function (event) {
    addBookToCompleted(
      event.target.parentElement.parentElement.parentElement.parentElement
        .parentElement
    );
  });
}

function createChecklistButton(buttonTypeClass, eventListener) {
  const buttonCompleted = document.createElement("button");
  buttonCompleted.classList.add(buttonTypeClass);
  buttonCompleted.addEventListener("click", function (event) {
    eventListener(event);
  });
  return buttonCompleted;
}

function addBook() {
  const uncompletedBookshelfList = document.getElementById(
    NotFinished_ReadBook_ID
  );
  const completeBookshelfList = document.getElementById(Finished_ReadBook_ID);
  const textJudul = document.getElementById("inputBookTitle").value;
  const penulis = document.getElementById("inputBookAuthor").value;
  const tahun = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const book = makeNotFinished(textJudul, `Penulis :${penulis}`, `Tahun :${tahun}`, isComplete);
  const BookObject = composeBook_Object(textJudul, penulis, tahun, isComplete);

  book[Book_ITEM_ID] = BookObject.id;
  books.push(BookObject);

  if (isComplete) {
    completeBookshelfList.append(book);
  } else {
    uncompletedBookshelfList.append(book);
  }
  updateDataToStorage();
}

function addBookToCompleted(BookElement) {
  BookElement = BookElement.parentNode;
  const bookCompleted = document.getElementById(Finished_ReadBook_ID);
  const textJudul = BookElement.querySelector("h3").innerText;
  const penulis = BookElement.querySelector("p").innerText;
  const tahun = BookElement.querySelector("p.yearBook").innerText;

  const newBook = makeNotFinished(textJudul, penulis, tahun, true);

  const book = findBook(BookElement[Book_ITEM_ID]);
  book.isComplete = true;
  newBook[Book_ITEM_ID] = book.id;

  bookCompleted.append(newBook);

  BookElement.remove();
  updateDataToStorage();
}

function removeBookFromCompleted(BookElement) {
  const bookPosition = findBookIndex(BookElement[Book_ITEM_ID]);
  books.splice(bookPosition, 1);

  BookElement.remove();
  updateDataToStorage();
}

function undoTaskFromCompleted(BookElement) {
  const notFinished = document.getElementById(NotFinished_ReadBook_ID);

  BookElement = BookElement.parentNode;
  const taskTitle = BookElement.querySelector("h3").innerText;
  const textBookAuthor = BookElement.querySelector("p").innerText;
  const textBookYear = BookElement.querySelector("p.yearBook").innerText;

  const newBook = makeNotFinished(
    taskTitle,
    textBookAuthor,
    textBookYear,
    false
  );

  const book = findBook(BookElement[Book_ITEM_ID]);
  book.isComplete = false;
  newBook[Book_ITEM_ID] = book.id;

  notFinished.append(newBook);
  BookElement.remove();

  updateDataToStorage();
}

function searchBook() {
  const searchBook = document.getElementById("searchBook-Title");
  const filter = searchBook.value.toUpperCase();
  const bookItem = document.querySelectorAll(".card-item");
  for (let i = 0; i < bookItem.length; i++) {
    txtValue = bookItem[i].textContent || bookItem[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      bookItem[i].style.display = "";
    } else {
      bookItem[i].style.display = "none";
    }
  }
}

function checkButton() {
  const span = document.querySelector("span");
  if (inputBookIsComplete.checked) {
    span.innerHTML = "<b>Selesai dibaca</b>";
  } else {
    span.innerHTML = "<b>Belum selesai dibaca</b>";
  }
}
