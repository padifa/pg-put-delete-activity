console.log("JavaScript Running");
refreshBooks();

// TODO - Add code for edit & delete buttons

function submitBook(event) {
  event.preventDefault();

  console.log("Submit button clicked.");
  let book = {};
  book.title = document.getElementById("title").value;
  book.author = document.getElementById("author").value;
  book.published = document.getElementById("published").value;

  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  axios({
    method: "POST",
    url: "/books",
    data: bookToAdd,
  })
    .then(function (response) {
      console.log("book was added to db");
      refreshBooks();
      clearForm();
    })
    .catch(function (error) {
      console.log("Error in POST", error);
      alert("Unable to add book at this time. Please try again later.");
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  axios({
    method: "GET",
    url: "/books",
  })
    .then(function (response) {
      console.log("refreshBooks() response", response.data);
      renderBooks(response.data);
    })
    .catch(function (error) {
      console.log("error in GET", error);
    });
}

// Displays an array of books to the DOM
function renderBooks(books) {
  const bookshelf = document.getElementById("bookShelf");
  bookshelf.innerHTML = "";

  for (let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    let check = () => (!book.isRead ? "read" : "unread");
    bookshelf.innerHTML += `
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.published}</td>
        <td>
        <button onClick="deleteBook(${book.id})">
        Delete
        </button>
        <button onClick="statusOnBook(${book.id}, true)">
       ${check()}
        </button>
        </td>
      </tr>
    `;
  }
}
function clearForm() {
  document.querySelector("#title").value = "";
  document.querySelector("#author").value = "";
  document.querySelector("#published").value = "";
}

function deleteBook(bookId) {
  refreshBooks();
  axios
    .delete(`/books/${bookId}`)
    .then((response) => {
      refreshBooks();
    })
    .catch((error) => {
      console.log("Error", error);
      alert("Something went wrong");
    });
}
function statusOnBook(bookId, bookStatus) {
  axios({
    method: "PUT",
    url: `/books/status/${bookId}`,
    data: {
      status: bookStatus,
    },
  })
    .then(function (response) {
      refreshBooks();
    })
    .catch(function (error) {
      alert("Error on status of book", error);
    });
}
