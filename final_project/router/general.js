
const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (users.find(user => user.username === username)) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(201).json({
        message: "User successfully registered"
    });
});


// Get all books
public_users.get('/', function (req, res) {
    res.json(books);
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.json(books[isbn]);
    } else {
        res.status(404).json({
            message: "Book not found"
        });
    }
});


// Get books based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    const result = Object.values(books).filter(book =>
        book.author.toLowerCase() === author.toLowerCase()
    );

    if (result.length === 0) {
        return res.status(404).json({
            message: "No books found for this author"
        });
    }

    res.json(result);
});


// Get books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    const result = Object.values(books).filter(book =>
        book.title.toLowerCase() === title.toLowerCase()
    );

    if (result.length === 0) {
        return res.status(404).json({
            message: "No books found with this title"
        });
    }

    res.json(result);
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.json(books[isbn].reviews);
    } else {
        res.status(404).json({
            message: "Book not found"
        });
    }
});


module.exports.general = public_users;

