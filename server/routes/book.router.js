const express = require("express");
const router = express.Router();

const pool = require("../modules/pool");

// Get all books
router.get("/", (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool
    .query(queryText)
    .then((result) => {
      // Sends back the results in an object
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("error getting books", error);
      res.sendStatus(500);
    });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post("/", (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("title", "author", "published")
                   VALUES ($1, $2, $3);`;
  pool
    .query(queryText, [newBook.title, newBook.author, newBook.published])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status
router.put("/status/:id", (req, res) => {
  let bookId = req.params.id;
  let sqlText = `UPDATE "books" SET "isRead"= NOT "isRead" WHERE id=$1;`;

  pool
    .query(sqlText, [bookId])
    .then((result) => {
      res.sendStatus(204);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

router.delete("/:id", (req, res) => {
  let bookId = req.params.id;
  let sqlText = `DELETE FROM "books" WHERE "id"=$1;`;

  pool
    .query(sqlText, [bookId])
    .then((result) => {
      res.sendStatus(204);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

// TODO - DELETE
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id

module.exports = router;
