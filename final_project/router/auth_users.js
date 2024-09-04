const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const user = users.find(user => user.username === username);
if (user!==undefined)
{
    return true;
}
return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const user = users.find(user => user.username === username);
if (user!==undefined)
{
    if(user.password === password)
    {
        return true;
    }
    return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  userName = req.body.username;
  password = req.body.password;
  if(userName === undefined || password === undefined)
  {
      return res.status(400).json({message: "please enter a username and password"});
  }
  if(authenticatedUser(userName,password))
  {
      let token = jwt.sign({username: userName}, 'access',{expiresIn: 60 * 60});
      req.session.authorization = {accessToken: token, user: userName};
      return res.status(200).json({message: ` ${req.session.authorization.user} logged in successfully `});

  }

  return res.status(300).json({message: "username or password is incorrect"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const newReview = req.query.review;
  const userName =req.session.authorization.user;
  if (newReview === undefined)
  {
      return res.status(400).json({message: "please enter a review"});
  }
  if (books[isbn] === undefined)
  {
      return res.status(404).json({message: "Book not found"});
  }

  if(books[isbn].reviews[userName])
  {
      books[isbn].reviews[userName] = newReview;
      return res.status(200).json({message: `${userName}'s Review updated successfully`});
  }
  books[isbn].reviews[`${userName}`] = newReview;
  return res.status(200).json({message: `${userName}'s Review added successfully`});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const userName =req.session.authorization.user;
  if (books[isbn].reviews[userName] === undefined)
  {
      return res.status(404).json({message: "Book not found"});
  }
  delete books[isbn].reviews[userName];
  res.status(200).json({message: `${userName}'s Review deleted successfully`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
