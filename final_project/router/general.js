const express = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
 const userName = req.body.username;
 const password = req.body.password;
 if(userName)
 {
 if(isValid(userName))
 {
     return res.status(400).json({message: "User already exists"});
 }
 if(password)
 {
  users.push({username: userName, password: password});
  res.status(200).json({message: "User registered successfully"});
 }
 else
 {
  return res.status(400).json({message: "please enter a password"});
 }
}
else
{
  return res.status(400).json({message: "please enter a username"});
}

  
});

// Get the book list available in the shop
public_users.get('/',async (req, res) => { // without using async/await
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4)) ; 
});

const axios = require('axios');
const books = require('./booksdb.js'); // This is the simulated database

  // This is the simulated database using async/await
public_users.get('/', async function (req, res) { 
    try {
        let listBooks = await axios.get('http://localhost:5000/books'); // This is the simulated API call
        return res.status(200).json(listBooks.data);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving book list' });
    }
});




// Get book details based on ISBN //without using async/await
public_users.get('/isbn/:isbn',function (req, res) { 
  //Write your code here
  const isbn = req.params.isbn;
  book = books[isbn];
  if (!book)
     {
    return res.status(404).json({message: "Book not found"});
     }
  return res.status(200).send(JSON.stringify(book, null, 4)); 
 });




 // Get book details based on ISBN using async/await (simulated API call)
public_users.get('/isbn/:isbn', async function (req, res) { 
  try{
    const isbn = req.params.isbn;
    let listBooks = await axios.get(`http://localhost:5000/books/isbn/${isbn}`);
    return res.status(200).json(listBooks.data);
  }
  catch(error)
  {
    return res.status(500).json({ message: `Error in retriving book with isbn ${isbn}` });
  }
});



// Get book details based on author without using async/await
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let bookKeys = Object.keys(books);
  let authorBooks = [];
  bookKeys.forEach((key) => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
        authorBooks.push(books[key]);
    }
});
  if (authorBooks.length === 0)
  {
    return res.status(404).json({message: "Author not found"});
  }
  return res.status(200).send(JSON.stringify(authorBooks, null, 4));
});




// Get book details based on author using async/await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  const books = await axios.get('http://localhost:5000/books');
  try{
  if(books.data)
  {
    for (const [isbn, book] of Object.entries(books.data)) {
        if (book.author.toLowerCase() === author.toLowerCase()) {
            authorBooks.push(book);
        }
    }
    if (authorBooks.length === 0)
    {
        return res.status(404).json({message: "Author not found"});
    }
    return res.status(200).send(JSON.stringify(authorBooks, null, 4));
  }
}
  catch(error)
  {
    return res.status(500).json({ message: `Error in retriving book with author ${author}` });
  }
});



// Get all books based on title without using async/await
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  const title = req.params.title;
  let bookKeys = Object.keys(books);
  let titleBooks = [];
  bookKeys.forEach((key) => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
        titleBooks.push(books[key]);
    }
  });
  if (titleBooks.length === 0)
  {
    return res.status(404).json({message: "Title not found"});
  }
  
  return res.status(200).send(JSON.stringify(titleBooks, null, 4));
});




// Get all books based on title using async/await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  let titleBooks = [];
  const books = await axios.get('http://localhost:5000/books');
  try
  {
    if(books.data)
    {
      for (const [isbn, book] of Object.entries(books.data)) {
          if (book.title.toLowerCase() === title.toLowerCase()) {
              titleBooks.push(book);
          }
      }
      if (titleBooks.length === 0)
      {
          return res.status(404).json({message: "Title not found"});
      }
      return res.status(200).send(JSON.stringify(titleBooks, null, 4));
    }
  }
  catch(error)
  {
    return res.status(500).json({ message: `Error in retriving book with title ${title}` });
  }
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(books[isbn] == undefined)
  {
    return res.status(404).json({message: "Book not found"});
  }
  return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
